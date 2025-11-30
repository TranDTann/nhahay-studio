import { useConfig } from '@/hooks/useConfig'
import { useFooterStore } from '@/store/footer/footerStore'
import { EConfig } from '@/types/config'
import { getConfigValue } from '@/utils/getConfig'
import { Button, Col, Modal, Row } from 'antd'
import { useEffect, useState } from 'react'
import { Logo } from '../Navigation/Logo'
import { ContactForm } from './ContactForm'
import { FollowUs } from './FollowUs'
import './styles.css'

const Footer = () => {
  const [isOpenContactFormModal, setIsOpenContactFormModal] = useState(false)

  const { configs } = useConfig()

  useEffect(() => {
    useFooterStore.setState({ configs })
  }, [configs])

  if (!configs.length) {
    return null
  }

  const description = getConfigValue(EConfig.ABOUT_US, configs)

  const isTablet = window.innerWidth < 767

  if (isTablet) {
    return (
      <div className="footer-wrapper">
        <Row gutter={24} className="footer-container">
          <Col span={13}>
            <Logo size="lg" />
            <p className="app-description display-max-10-lines">
              {description}
            </p>
          </Col>
          <Col span={11}>
            <FollowUs />
            <Button
              type="primary"
              style={{ marginTop: '16px' }}
              onClick={() => setIsOpenContactFormModal(true)}
            >
              Gửi liên hệ
            </Button>
          </Col>
        </Row>
        {isOpenContactFormModal && (
          <Modal
            open={isOpenContactFormModal}
            footer={null}
            onCancel={() => setIsOpenContactFormModal(false)}
            title="Liên hệ"
          >
            <ContactForm />
          </Modal>
        )}
      </div>
    )
  }

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
