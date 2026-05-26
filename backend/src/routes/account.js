import { UserModel } from '../models/BuyMe'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

exports.GetUserAccount = async (req, res) => {
    const user_id = req.query.user_id
    let user = await UserModel.findOne({ user_id })
    if (!user) throw new Error('userID not found!')
    res.send({ data: user })
}

exports.EditUserAccount = async (req, res) => {
    let item = req.body.item
    let newValue = req.body.newValue

    const existing = await UserModel.findOne({ user_id: req.body.user_id })

    if (existing) {
        // Update UserModel
        try {
            if (item[0] === 'name') {
                const user = await UserModel.findOneAndUpdate(
                    {
                        user_id: req.body.user_id,
                    },
                    {
                        name: newValue[0],
                    },
                    {new:true}
                )
                res.status(200).send({ message: `Updating successfully!`, contents: user })

            } else {
                const user = await UserModel.findOneAndUpdate(
                    {
                        user_id: req.body.user_id,
                    },
                    {
                        bankaccount:{ bank_id: newValue[0],
                                      bankaccount_id: newValue[1]},
                    },
                    {new:true}
                )
                res.status(200).send({ message: `Updating successfully!`, contents: user })
            }
        } catch (e) {
            throw new Error('Account updating error: ' + e)
        }
    } else {
        res.status(204).json({ message: `Account doesn't exist!` })
    }
}

exports.ChangePassword = async (req, res) => {
    const { user_id, currentPassword, newPassword } = req.body
    const existing = await UserModel.findOne({ user_id })
    if (!existing) {
        return res.status(404).json({ message: 'error', content: "Account doesn't exist!" })
    }

    const match = await bcrypt.compare(currentPassword, existing.password)
    if (!match) {
        return res.status(401).json({ message: 'error', content: 'Current password is not correct!' })
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
        await UserModel.findOneAndUpdate({ user_id }, { password: hashedPassword })
        res.status(200).json({ message: 'success', content: `Password updated!` })
    } catch (e) {
        throw new Error('Password updating error: ' + e)
    }
}
