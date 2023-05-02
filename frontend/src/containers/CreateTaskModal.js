import {
    Modal,
    Form,
    Input,
    InputNumber,
    Space,
    Button,
    DatePicker,
    TimePicker,
} from 'antd'
import { useState } from 'react'

const { TextArea } = Input

const layout = {
    labelCol: {
        span: 7,
    },
    wrapperCol: {
        span: 14,
    },
}

const CreateTaskModal = ({ open, onCreate, onCancel }) => {
    const [form] = Form.useForm()

    return (
        <Modal
            open={open}
            title="Create New BuyMe Task"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            width={800}
            onOk={() => {
                form.validateFields().then((values) => {
                    onCreate(values)
                    form.resetFields()
                })
            }}
        >
            <Form {...layout} name="nest-messages" form={form}>
                <Form.Item
                    name="title"
                    label="標題"
                    rules={[
                        {
                            required: true,
                            message: '請輸入任務標題!',
                        },
                    ]}
                >
                    <Input placeholder="請輸入任務標題" />
                </Form.Item>
                <Form.Item
                    name="restaurant"
                    label="餐廳"
                    rules={[
                        {
                            required: true,
                            message: '請輸入餐廳名稱!',
                        },
                    ]}
                >
                    <Input placeholder="請輸入餐廳名稱" />
                </Form.Item>
                <Form.Item
                    name="fee"
                    label="外送費用"
                    rules={[
                        {
                            required: true,
                            message: '請輸入外送費用!',
                        },
                    ]}
                >
                    <InputNumber
                        prefix="$"
                        placeholder="打算付多少外送費？ eg. 10 元、20 元"
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item
                    name="arrivalStart"
                    label="希望送達時間(開始)"
                    rules={[
                        {
                            required: true,
                            message: '請輸入希望送達時段!',
                        },
                    ]}
                >
                    <DatePicker showTime placeholder="希望餐點送達時段？" />
                </Form.Item>
                <Form.Item
                    name="arrivalEnd"
                    label="預計送達時間(結束)"
                    rules={[
                        {
                            required: true,
                            message: '請輸入希望送達時段!',
                        },
                    ]}
                >
                    <DatePicker showTime placeholder="希望餐點送達時段？" />
                </Form.Item>
                <Form.Item
                    name="content"
                    label="內容"
                    rules={[
                        {
                            required: true,
                            message: '請輸入內容!',
                        },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="請輸入詳細內容。eg. 餐點名稱、份數、飲料、冰塊甜度、備註"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default CreateTaskModal
