import { Col, Row } from 'antd'
import { Logo } from '../Navigation/Logo'
import { ContactForm } from './ContactForm'
import { FollowUs } from './FollowUs'
import './styles.css'

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <Row gutter={24} className="footer-container">
        <Col span={6}>
          <Logo size="lg" />
          <p className="app-description">
            NhaHayStudio cung cấp bài viết đánh giá chi tiết, khách quan về các
            thiết bị và vật dụng trong nhà như nồi cơm điện, tủ lạnh, lavabo,
            vòi hoa sen, máy lọc không khí và nhiều sản phẩm khác để giúp bạn
            chọn mua dễ dàng hơn.
          </p>
        </Col>
        <Col span={13}>
          <ContactForm />
        </Col>
        <Col span={5}>
          <FollowUs />
        </Col>
      </Row>
    </div>
  )
}

export default Footer
