'use client'

import React from 'react'
import { useConfigContext } from '@/contexts/ConfigContext'
import './styles.css'

const LedTextBanner = () => {
    const { getConfigByKey } = useConfigContext()
    const ledText = getConfigByKey('LED_TEXT')

    // Chỉ hiển thị nếu có text
    if (!ledText || ledText.trim() === '') {
        return null
    }

    // Tạo text với separator để tạo hiệu ứng lặp liên tục
    const textWithSeparator = `${ledText} • `

    return (
        <div className="led-text-banner">
            <div className="led-text-wrapper">
                <div className="led-text-scroll">
                    <span className="led-text-item">{textWithSeparator}</span>
                </div>
            </div>
        </div>
    )
}

export default LedTextBanner

