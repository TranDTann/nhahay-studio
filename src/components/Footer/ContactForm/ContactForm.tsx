import { Button, Col, Form, Input, Row } from 'antd'
import {
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined
} from '@ant-design/icons'
import './styles.css'
const { TextArea } = Input

const ContactForm = () => {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    form.resetFields()
  }

  const onFinishFailed = (errorInfo) => {}

  return (
    <div className="contact-form-container">
      <h1 className="contact-form-title">Liên hệ</h1>
      <Form
        form={form}
        name="contact_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Row gutter={24}>
          <Col span={15}>
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: 'Vui lòng nhập tên của bạn!' },
                { min: 3, message: 'Tên phải có ít nhất 3 ký tự.' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập họ và tên của bạn"
                className="contact-input"
              />
            </Form.Item>
          </Col>
          <Col span={9}>
            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                {
                  pattern: /^\d{10,11}$/,
                  message: 'Số điện thoại không hợp lệ (10-11 chữ số).'
                }
              ]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Nhập số điện thoại của bạn"
                className="contact-input"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ email!' },
                { type: 'email', message: 'Địa chỉ email không hợp lệ!' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Nhập địa chỉ email của bạn"
                className="contact-input"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              rules={[
                { required: true, message: 'Vui lòng nhập địa chỉ của bạn!' },
                { min: 5, message: 'Địa chỉ phải có ít nhất 5 ký tự.' }
              ]}
            >
              <Input
                prefix={<HomeOutlined />}
                placeholder="Nhập địa chỉ của bạn"
                className="contact-input"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="note">
          <TextArea
            prefix="1111"
            placeholder="Ghi chú"
            autoSize={{ minRows: 3, maxRows: 5 }}
            className="contact-input"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Gửi Liên hệ
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ContactForm
