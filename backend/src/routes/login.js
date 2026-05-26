import { UserModel } from '../models/BuyMe'
import bcrypt from 'bcrypt'

exports.UserLogin = async (req, res) => {
    const { userId, password } = req.body

    const user = await UserModel.findOne({ user_id: userId })

    if (!user) {
        res.status(400).send({
            message: 'error',
            content: 'User does not exist!',
        })
    } else {
        const match = await bcrypt.compare(password, user.password)
        if (match) {
            res.status(200).send({
                message: 'success',
                content: {
                    name: user.name,
                    id: user.user_id,
                },
            })
        } else {
            res.status(401).send({
                message: 'error',
                content: 'Wrong password!',
            })
        }
    }
}
