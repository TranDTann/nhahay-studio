'use client'
import React from 'react';
import { Image } from 'antd';
import { useSessionConfig } from '@/hooks/useSessionConfig';
import '@/assets/style/AdvertisementSection.scss';

const AdvertisementSection: React.FC = () => {
    const { getConfigByKey } = useSessionConfig();

    // Lấy các config từ session storage
    const websiteUrl = getConfigByKey('website') || 'https://nhahaystudio.com';
    const siteName = getConfigByKey('site_name') || 'nhahaystudio.vn';
    const facebookUrl = getConfigByKey('facebook');
    const youtubeUrl = getConfigByKey('youtube');
    const tiktokUrl = getConfigByKey('tiktok');

    const socialPlatforms = [
        {
            name: 'Youtube',
            color: '#e53935',
            description: 'Chia sẻ những clip chuyên sâu và thú vị',
            url: youtubeUrl
        },
        {
            name: 'Tiktok',
            color: '#1da1f2',
            description: 'Tóm tắt tin và những đánh giá nhanh',
            url: tiktokUrl
        },
        {
            name: 'Facebook',
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
            <p style={{ fontSize: 16, marginBottom: 16 }}>
                Những người theo dõi <span className="site-name">{siteName}</span> đã lâu khi muốn tìm mua các sản phẩm mà chúng tôi review họ sẽ truy cập vào
                <a
                    className="website-link"
                    style={{ marginLeft: 4 }}
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {websiteUrl.replace(/^https?:\/\//, '')}
                </a>
                (đây là website con nằm trong hệ sinh thái NHÀ, tại đây trưng bày các sản phẩm mà chúng tôi đánh giá là HAY!)
            </p>

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
                    {siteName} là sản phẩm nằm trong hệ sinh thái Nhà của chúng tôi gồm:
                    {socialPlatforms.map((platform, index) => (
                        <React.Fragment key={platform.name}>
                            {index > 0 && index === socialPlatforms.length - 1 && ' và '}
                            {index > 0 && index < socialPlatforms.length - 1 && ', '}
                            <a style={{ color: platform.color }} href={platform.url} target="_blank" rel="noopener noreferrer">
                                {platform.name} Nhà hay Studio
                            </a>
                        </React.Fragment>
                    ))}
                    ...vv
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32 }}>
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
                                marginBottom: 16
                            }}
                            onClick={() => platform.url && handleSocialClick(platform.url, platform.name)}
                            title={platform.url ? `Click để truy cập ${platform.name}` : ''}
                        >
                            <h4 className="platform-name" style={{ color: platform.color }}>
                                {platform.name}
                            </h4>
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