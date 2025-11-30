'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { bannerCrud, Banner } from '@/store/banner/crud'
import './styles.css'

const PopupBanner = () => {
    const pathname = usePathname()
    const [popupBanner, setPopupBanner] = useState<Banner | null>(null)
    const [visible, setVisible] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPopupBanner = async () => {
            try {
                setLoading(true)
                // Lấy tất cả banners
                const response = await bannerCrud.getBanners({ take: 1000 })
                if (response?.result) {
                    // Tìm banner có title = "POPUP_BANNER"
                    const banner = response.result.find(
                        (b) => b.title === 'POPUP_BANNER' && b.status === true
                    )
                    if (banner) {
                        setPopupBanner(banner)
                        setVisible(true)
                    } else {
                        setPopupBanner(null)
                        setVisible(false)
                    }
                }
            } catch (error) {
                console.error('Failed to fetch popup banner:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPopupBanner()
    }, [pathname])

    const handleClose = () => {
        setVisible(false)
    }

    const handleBannerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (popupBanner?.redirectUrl) {
            window.open(popupBanner.redirectUrl, '_blank', 'noopener,noreferrer')
        }
    }

    if (loading || !popupBanner) {
        return null
    }

    return (
        <Modal
            open={visible}
            onCancel={handleClose}
            footer={null}
            closable={false}
            maskClosable={true}
            width={popupBanner.imageUrl ? 'auto' : 400}
            className="popup-banner-modal"
            centered
        >
            <div className="popup-banner-container">
                <button className="popup-banner-close" onClick={handleClose}>
                    <CloseOutlined />
                </button>
                {popupBanner.imageUrl && (
                    <div
                        className="popup-banner-image-wrapper"
                        onClick={handleBannerClick}
                        role={popupBanner.redirectUrl ? 'button' : undefined}
                        tabIndex={popupBanner.redirectUrl ? 0 : undefined}
                        onKeyDown={(e) => {
                            if (popupBanner.redirectUrl && (e.key === 'Enter' || e.key === ' ')) {
                                e.preventDefault()
                                handleBannerClick(e as any)
                            }
                        }}
                        style={{ cursor: popupBanner.redirectUrl ? 'pointer' : 'default' }}
                    >
                        <img
                            src={popupBanner.imageUrl}
                            alt={popupBanner.title}
                            className="popup-banner-image"
                            draggable={false}
                        />
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default PopupBanner

