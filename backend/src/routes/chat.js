import { ChatBoxModel, UserModel, TaskModel } from '../models/BuyMe'
import { TASK_STATUS, canTransition } from '../utils/taskStatus'

exports.GetChat = async (req, res) => {
    const id = req.query.id
    const user = await UserModel.findOne({ user_id: id })
    const chatRooms = await ChatBoxModel.find({
        $or: [
            {
                sender: user,
            },
            {
                receiver: user,
            },
        ],
    }).populate('messages')
    res.send({ chatRooms: chatRooms })
}

exports.FulfillOrder = async (req, res) => {
    const senderID = req.body.senderID
    const receiverID = req.body.receiverID
    const userID = req.body.userID
    const taskID = req.body.taskID

    const task = await TaskModel.findOne({ sender: senderID, receiver: receiverID })
    if (!task) {
        return res.status(404).json({ message: 'error', content: 'Task not found' })
    }
    if (!canTransition(task.status, TASK_STATUS.COMPLETED)) {
        return res.status(400).json({ message: 'error', content: 'Invalid status transition' })
    }

    try {
        await TaskModel.findOneAndUpdate(
            { _id: task._id },
            { status: TASK_STATUS.COMPLETED }
        )
    } catch (e) {
        console.log(e)
    }

    try {
        await ChatBoxModel.findOneAndDelete({ task_id: taskID })
    } catch (e) {
        console.log(e)
    }

    const user = await UserModel.findOne({ user_id: userID })
    const chatRooms = await ChatBoxModel.find({
        $or: [
            {
                sender: user,
            },
            {
                receiver: user,
            },
        ],
    }).populate('messages')
    res.send({ chatRooms: chatRooms })
}
