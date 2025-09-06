import { useConfig } from '@/hooks/useConfig'
import { useFooterStore } from '@/store/footer/footerStore'
import { getConfigValue } from '@/utils/getConfig'
import { Col, Row } from 'antd'
import { useEffect } from 'react'
import { Logo } from '../Navigation/Logo'
import { ContactForm } from './ContactForm'
import { FollowUs } from './FollowUs'
import './styles.css'

const Footer = () => {
  const { configs } = useConfig()

  useEffect(() => {
    useFooterStore.setState({ configs })
  }, [configs])

  if (!configs.length) {
    return null
  }

  const description = getConfigValue('ABOUT-US', configs)

  return (
    <div className="footer-wrapper">
      <Row gutter={24} className="footer-container">
        <Col span={6}>
          <Logo size="lg" />
          <p className="app-description display-max-10-lines">{description}</p>
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
