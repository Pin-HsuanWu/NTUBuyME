import { UserModel } from '../models/BuyMe'
import bcrypt from 'bcrypt'
import { generateToken } from '../middleware/auth'
import { encrypt } from '../utils/crypto'

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
            bankaccount: { bank_id: encrypt(bank_id),
                           bankaccount_id: encrypt(bankaccount_id) },
        })
        await user.save()
        const token = generateToken(id)
        res.status(200).send({
            message: 'success',
            content: {
                token,
                name,
                id,
            },
        })
    } else {
        res.send({
            message: 'error',
            content: 'User already exists!',
        })
    }
}
