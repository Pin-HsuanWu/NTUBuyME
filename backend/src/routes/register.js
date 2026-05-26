import { UserModel } from '../models/BuyMe'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

exports.UserRegister = async (req, res) => {
    const {
        user: { name, id, password, bank_id, bankaccount_id },
    } = req.body

    const existing = await UserModel.findOne({ user_id: id }).exec()

    if (!existing) {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
        const user = new UserModel({
            user_id: id,
            name: name,
            password: hashedPassword,
            bankaccount: { bank_id: bank_id,
                           bankaccount_id: bankaccount_id},
        })
        await user.save()
        res.status(200).send({
            message: 'success',
            content: 'Account created!',
        })
    } else {
        res.send({
            message: 'error',
            content: 'User already exists!',
        })
    }
}
