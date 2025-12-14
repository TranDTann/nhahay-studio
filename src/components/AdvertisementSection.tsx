'use client'
import React from 'react';
import { Image } from 'antd';
import { YoutubeOutlined, TikTokOutlined, FacebookOutlined } from '@ant-design/icons';
import { useSessionConfig } from '@/hooks/useSessionConfig';
import '@/assets/style/AdvertisementSection.scss';
import { EConfig } from '@/types/config';

const AdvertisementSection: React.FC = () => {
    const { getConfigByKey } = useSessionConfig();

    // Lấy các config từ session storage
    const websiteUrl = getConfigByKey(EConfig.WEBSITE_URL) || 'https://nhahaystudio.com';
    const siteName = getConfigByKey(EConfig.SITE_NAME) || 'nhahaystudio.vn';
    const sloganBottom = getConfigByKey(EConfig.SLOGAN_BOTTOM) || `${siteName} là sản phẩm nằm trong hệ sinh thái Nhà của chúng tôi gồm:`;
    const sloganTop = getConfigByKey(EConfig.SLOGAN_TOP) || '';
    const facebookUrl = getConfigByKey(EConfig.FACEBOOK);
    const youtubeUrl = getConfigByKey(EConfig.YOUTUBE);
    const tiktokUrl = getConfigByKey(EConfig.TIKTOK);

    const socialPlatforms = [
        {
            name: 'Youtube',
            iconComponent: YoutubeOutlined,
            color: '#e53935',
            description: 'Chia sẻ những clip chuyên sâu và thú vị',
            url: youtubeUrl
        },
        {
            name: 'Tiktok',
            iconComponent: TikTokOutlined,
            color: '#000000',
            description: 'Tóm tắt tin và những đánh giá nhanh',
            url: tiktokUrl
        },
        {
            name: 'Facebook',
            iconComponent: FacebookOutlined,
            color: '#1877f2',
            description: 'Cập nhật các thông báo mới nhất tới bạn đọc',
            url: facebookUrl
        }
    ].filter(platform => platform.url); // Chỉ hiển thị những platform có URL

    const handleSocialClick = (url: string, platform: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="advertisement-section" style={{ width: '100%', margin: '32px 0', textAlign: 'center' }}>
            {sloganTop && (
                <p style={{ fontSize: 16, marginBottom: 16 }}>
                    {sloganTop}
                </p>
            )}

            <div style={{ width: 'auto', maxWidth: 600, margin: '0 auto 24px auto' }}>
                <img
                    src="https://hangnhatchuan365.com/wp-content/uploads/2020/11/logo-hangnhatchuan365-removebg-preview-e1604745026115.png"
                    alt="nhahaystudio.com"
                    style={{ maxWidth: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 200 }}
                />
            </div>

            <div style={{
                margin: '0 auto',
                background: '#fafbfc',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
                <p style={{ fontSize: 15, marginBottom: 24 }}>
                    {sloganBottom}
                </p>

                <div className="social-platforms-container" style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', gap: 16 }}>
                    {socialPlatforms.map((platform) => (
                        <div
                            key={platform.name}
                            className={`social-platform-card ${!platform.url ? 'no-url' : ''}`}
                            style={{
                                minWidth: 180,
                                maxWidth: 220,
                                background: '#fff',
                                borderRadius: 12,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                                padding: 16,
                                marginBottom: 4,
                                flex: '0 0 auto'
                            }}
                            onClick={() => platform.url && handleSocialClick(platform.url, platform.name)}
                            title={platform.url ? `Click để truy cập ${platform.name}` : ''}
                        >
                            <div className="platform-name" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '32px', color: platform.color }}>
                                    {React.createElement(platform.iconComponent, { style: { color: platform.color } })}
                                </span>
                            </div>
                            <p className="platform-description">
                                {platform.description}
                            </p>
                            {platform.url && (
                                <div className="click-hint" style={{ color: platform.color }}>
                                    Click để truy cập
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default AdvertisementSection; 