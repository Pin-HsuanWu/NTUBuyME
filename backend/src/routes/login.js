import { UserModel } from '../models/BuyMe'
import bcrypt from 'bcrypt'
import { generateToken } from '../middleware/auth'

exports.UserLogin = async (req, res) => {
    const { userId, password } = req.body

    const user = await UserModel.findOne({ user_id: userId })
    const match = user && (await bcrypt.compare(password, user.password))

    if (!match) {
        return res.status(401).send({
            message: 'error',
            content: 'Invalid user ID or password',
        })
    }

    const token = generateToken(user.user_id)
    res.status(200).send({
        message: 'success',
        content: {
            name: user.name,
            id: user.user_id,
            token,
        },
    })
}
