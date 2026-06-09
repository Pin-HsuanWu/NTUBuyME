import { MessageModel, TaskModel } from '../models/BuyMe'
import { UserModel } from '../models/BuyMe'
import { ChatBoxModel } from '../models/BuyMe'
import { TASK_STATUS, canTransition } from '../utils/taskStatus'

exports.FilterTasksByDueStart = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const skip = (page - 1) * limit

    const [allTasks, total] = await Promise.all([
        TaskModel.find({ status: 'open' })
            .sort({ due_start: 1 })
            .skip(skip)
            .limit(limit),
        TaskModel.countDocuments({ status: 'open' }),
    ])

    res.send({ allTasks, total, page, totalPages: Math.ceil(total / limit) })
}

exports.FilterTasksByFee = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const skip = (page - 1) * limit

    const [allTasks, total] = await Promise.all([
        TaskModel.find({ status: 'open' })
            .sort({ fee: -1 })
            .skip(skip)
            .limit(limit),
        TaskModel.countDocuments({ status: 'open' }),
    ])

    res.send({ allTasks, total, page, totalPages: Math.ceil(total / limit) })
}

exports.DeleteAllTasks = async (_, res) => {
    await TaskModel.deleteMany({})
    await ChatBoxModel.deleteMany({})
    await MessageModel.deleteMany({})
    res.send({ success: true })
}

exports.GetTaskNum = async (_, res) => {
    const offset = new Date(Date.now())
    const DayRange = 2
    offset.setDate(offset.getDate() - DayRange)
    const taskNum = await TaskModel.countDocuments({
        status: 'open',
        created_at: { $gt: offset },
    })
    res.send({ taskNum })
}

exports.AddDummyTasks = async (_, res) => {
    const person = await UserModel.findOne({ user_id: 'R11725051' })
    const D = new Date(Date.now())

    for (let i = 0; i < 1; i++) {
        const t = new TaskModel({
            sender: person,
            created_at: new Date(Date.now()),
            title: 'Dummy',
            restaurantName: 'Dummy Restaurant',
            taskContent: 'Dummy Task',
            due_start: D.setDate(D.getDate() - 4),
            due_end: new Date(Date.now()),
            fee: 10000,
            status: 'open',
        })
        await t.save()
    }

    res.send({ success: true })
}

exports.GetMyAddedTasks = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const skip = (page - 1) * limit
    const id = req.query.id
    const myUserModel = await UserModel.findOne({ user_id: id })

    const filter = { sender: myUserModel._id, status: { $in: ['accepted', 'completed'] } }
    const [myTasks, total] = await Promise.all([
        TaskModel.find(filter).sort({ status: 1, due_end: 1 }).skip(skip).limit(limit),
        TaskModel.countDocuments(filter),
    ])

    res.send({ myTasks, total, page, totalPages: Math.ceil(total / limit) })
}

exports.GetMyAcceptedTasks = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 20, 100)
    const skip = (page - 1) * limit
    const id = req.query.id
    const myUserModel = await UserModel.findOne({ user_id: id })

    const filter = { receiver: myUserModel._id, status: { $in: ['accepted', 'completed'] } }
    const [myTasks, total] = await Promise.all([
        TaskModel.find(filter).sort({ status: 1, due_end: 1 }).skip(skip).limit(limit),
        TaskModel.countDocuments(filter),
    ])

    res.send({ myTasks, total, page, totalPages: Math.ceil(total / limit) })
}

exports.CreateTask = async (req, res) => {
    const {
        id,
        title,
        restaurant,
        fee,
        arrivalStart,
        arrivalEnd,
        taskContent,
    } = req.body

    const myUserModel = await UserModel.findOne({ user_id: id })
    const newTask = new TaskModel({
        sender: myUserModel,
        created_at: new Date(Date.now()),
        title: title,
        restaurantName: restaurant,
        taskContent: taskContent,
        due_start: arrivalStart,
        due_end: arrivalEnd,
        fee: fee,
        status: 'open',
    })

    await newTask.save()
    res.status(201).send({ message: 'success', content: 'Task created' })
}

exports.AcceptTasks = async (req, res) => {
    const makeName = (name, to) => {
        return [name, to].sort().join('_')
    }

    const { id, receiver } = req.body
    const user = await UserModel.findOne({ user_id: receiver })
    const task = await TaskModel.findOne({ _id: id })

    if (!canTransition(task.status, TASK_STATUS.ACCEPTED)) {
        return res.status(400).json({ message: 'error', content: 'Invalid status transition' })
    }

    const task_populated = await task.populate({
        path: 'sender',
        select: 'name',
    })
    const senderName = task_populated.sender.name
    const chatBoxName = makeName(user.name, senderName)
    await TaskModel.updateOne(
        { _id: id },
        { receiver: user, status: TASK_STATUS.ACCEPTED }
    )
    const newChatRoom = new ChatBoxModel({
        name: chatBoxName,
        title: task.title,
        sender: task.sender,
        receiver: user,
        due_start: task.due_start,
        due_end: task.due_end,
        fee: task.fee,
        from: senderName,
        task_id: task._id,
    })

    newChatRoom.save()
    res.send({
        message: 'success',
        content: 'Task Accepted',
    })
}
