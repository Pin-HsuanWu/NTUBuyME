import loginRoute from './login'
import registerRoute from './register'
import accountRoute from './account'
import transferRoute from './transfer'
import buymeRoute from './task'
import chatRoute from './chat'
import qrCodeRoute from './qrcode'
import { authMiddleware } from '../middleware/auth'

const wrap =
    (fn) =>
    (...args) =>
        fn(...args).catch(args[2])

function main(app) {
    // Public routes
    app.post('/api/login', wrap(loginRoute.UserLogin))
    app.post('/api/register', wrap(registerRoute.UserRegister))

    // Protected routes
    app.get('/api/account', authMiddleware, wrap(accountRoute.GetUserAccount))
    app.post('/api/account', authMiddleware, wrap(accountRoute.EditUserAccount))
    app.post('/api/changePassword', authMiddleware, wrap(accountRoute.ChangePassword))
    app.get('/api/transfer', authMiddleware, wrap(transferRoute.GetTransferAccount))
    app.get('/api/getReceiverId', authMiddleware, wrap(transferRoute.GetReceiverId))
    app.get('/api/allTasksByDueStart', authMiddleware, wrap(buymeRoute.FilterTasksByDueStart))
    app.get('/api/allTasksByFee', authMiddleware, wrap(buymeRoute.FilterTasksByFee))
    app.post('/api/delete', authMiddleware, wrap(buymeRoute.DeleteAllTasks))
    app.get('/api/taskNum', authMiddleware, wrap(buymeRoute.GetTaskNum))
    app.get('/api/myTasks', authMiddleware, wrap(buymeRoute.GetMyTasks))
    app.post('/api/addTasks', authMiddleware, wrap(buymeRoute.AddDummyTasks))
    app.get('/api/myAddedTasks', authMiddleware, wrap(buymeRoute.GetMyAddedTasks))
    app.get('/api/myAcceptedTasks', authMiddleware, wrap(buymeRoute.GetMyAcceptedTasks))
    app.post('/api/createTask', authMiddleware, wrap(buymeRoute.CreateTask))
    app.post('/api/acceptTask', authMiddleware, wrap(buymeRoute.AcceptTasks))
    app.get('/api/getChat', authMiddleware, wrap(chatRoute.GetChat))
    app.post('/api/fulfillOrder', authMiddleware, wrap(chatRoute.FulfillOrder))
    app.get('/api/qrcode', authMiddleware, wrap(qrCodeRoute.GetQRCode))
}

export default main
