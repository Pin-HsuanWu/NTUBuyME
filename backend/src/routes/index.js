import loginRoute from './login'
import registerRoute from './register'
import accountRoute from './account'
import transferRoute from './transfer'
import buymeRoute from './task'
import chatRoute from './chat'
import qrCodeRoute from './qrcode'
import { authMiddleware } from '../middleware/auth'
import { authLimiter, apiLimiter } from '../middleware/rateLimit'
import { body } from 'express-validator'
import { validate } from '../middleware/validate'

const wrap =
    (fn) =>
    (...args) =>
        fn(...args).catch(args[2])

const loginValidation = [
    body('userId').notEmpty().withMessage('Student ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
]

const registerValidation = [
    body('user.name').notEmpty().withMessage('Name is required'),
    body('user.id').notEmpty().withMessage('Student ID is required'),
    body('user.password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('user.bank_id').notEmpty().withMessage('Bank ID is required'),
    body('user.bankaccount_id').notEmpty().withMessage('Bank account ID is required'),
    validate,
]

const changePasswordValidation = [
    body('user_id').notEmpty().withMessage('User ID is required'),
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate,
]

function main(app) {
    // Public routes (strict rate limit)
    app.post('/api/login', authLimiter, loginValidation, wrap(loginRoute.UserLogin))
    app.post('/api/register', authLimiter, registerValidation, wrap(registerRoute.UserRegister))

    // Protected routes
    app.use('/api', apiLimiter)
    app.get('/api/account', authMiddleware, wrap(accountRoute.GetUserAccount))
    app.post('/api/account', authMiddleware, wrap(accountRoute.EditUserAccount))
    app.post('/api/changePassword', authMiddleware, changePasswordValidation, wrap(accountRoute.ChangePassword))
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
