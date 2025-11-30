'use client'
import React, { useState, useEffect } from 'react';
import { Button, Space, Tooltip } from 'antd';
import {
    FacebookOutlined,
    InstagramOutlined,
    TikTokOutlined,
    YoutubeOutlined,
    TwitterOutlined,
    LinkedinOutlined
} from '@ant-design/icons';
import { useSessionConfig } from '@/hooks/useSessionConfig';
import '@/assets/style/SocialMediaLinks.scss';

interface SocialMediaLinksProps {
    className?: string;
    size?: 'small' | 'middle' | 'large';
    showLabels?: boolean;
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({
    className = '',
    size = 'middle',
    showLabels = false
}) => {
    const { loading, getSocialMediaUrls } = useSessionConfig();
    const { FACEBOOK, INSTAGRAM, TIKTOK, YOUTUBE, TWITTER, LINKEDIN } = getSocialMediaUrls();

    const socialLinks = [
        {
            key: 'facebook',
            icon: <FacebookOutlined />,
            url: FACEBOOK,
            label: 'Facebook',
            color: '#1877f2'
        },
        {
            key: 'instagram',
            icon: <InstagramOutlined />,
            url: INSTAGRAM,
            label: 'Instagram',
            color: '#e4405f'
        },
        {
            key: 'tiktok',
            icon: <TikTokOutlined />,
            url: TIKTOK,
            label: 'TikTok',
            color: '#000000'
        },
        {
            key: 'youtube',
            icon: <YoutubeOutlined />,
            url: YOUTUBE,
            label: 'YouTube',
            color: '#ff0000'
        },
        {
            key: 'twitter',
            icon: <TwitterOutlined />,
            url: TWITTER,
            label: 'Twitter',
            color: '#1da1f2'
        },
        {
            key: 'linkedin',
            icon: <LinkedinOutlined />,
            url: LINKEDIN,
            label: 'LinkedIn',
            color: '#0077b5'
        }
    ].filter(link => link.url); // Chỉ hiển thị những link có URL

    const handleSocialClick = (url: string, platform: string) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) {
        return (
            <div className={`social-media-links ${className}`}>
                <Space size={size === 'small' ? 8 : 12}>
                    {[1, 2, 3].map(i => (
                        <div
                            key={i}
                            style={{
                                width: size === 'small' ? 32 : size === 'large' ? 48 : 40,
                                height: size === 'small' ? 32 : size === 'large' ? 48 : 40,
                                backgroundColor: '#f0f0f0',
                                borderRadius: '50%',
                                animation: 'pulse 1.5s infinite'
                            }}
                        />
                    ))}
                </Space>
            </div>
        );
    }

    return (
        <div className={`social-media-links ${className}`}>
            <Space size={size === 'small' ? 8 : 12} wrap>
                {socialLinks.map((link) => (
                    <Tooltip key={link.key} title={showLabels ? undefined : link.label}>
                        <Button
                            type="text"
                            icon={link.icon}
                            size={size}
                            onClick={() => handleSocialClick(link.url!, link.key)}
                            style={{
                                width: size === 'small' ? 32 : size === 'large' ? 48 : 40,
                                height: size === 'small' ? 32 : size === 'large' ? 48 : 40,
                            }}
                            className={`social-media-button`}
                            data-platform={link.key}
                        >
                            {showLabels && (
                                <span style={{ marginLeft: 8, fontSize: size === 'small' ? 12 : 14 }}>
                                    {link.label}
                                </span>
                            )}
                        </Button>
                    </Tooltip>
                ))}
            </Space>
        </div>
    );
};

export default SocialMediaLinks; 