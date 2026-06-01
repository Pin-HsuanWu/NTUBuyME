import { UserModel } from '../models/BuyMe'
import { decrypt } from '../utils/crypto'

exports.GetReceiverId = async (req, res) => {
    let user = await UserModel.findOne({ _id: req.query.userObjId })
    if (!user) {
        res.status(200).send({
            message: 'error',
            content: 'Cannot find user with this ID!',
        })
    } else {
        res.status(200).send({
            message: 'success',
            content: {
                id: user.user_id,
            },
        })
    }
}

exports.GetTransferAccount = async (req, res) => {
    const { userId } = req.query
    let user = await UserModel.findOne({ user_id: userId })
    if (!user) {
        res.status(200).send({
            message: 'error',
            content: 'Cannot find user with this ID!',
        })
    } else {
        res.status(200).send({
            message: 'success',
            content: {
                name: user.name,
                id: user.user_id,
                bankaccount: {
                    bank_id: decrypt(user.bankaccount.bank_id),
                    bankaccount_id: decrypt(user.bankaccount.bankaccount_id),
                },
            },
        })
    }
}
