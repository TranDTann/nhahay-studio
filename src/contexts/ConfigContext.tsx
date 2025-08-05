'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { configService, ConfigItem, ConfigQueryParams } from '@/api/configService';
import { sessionStorageUtils } from '@/utils/sessionStorage';

interface ConfigContextType {
    configs: ConfigItem[];
    loading: boolean;
    error: string | null;
    getConfigByKey: (key: string) => string | null;
    refreshConfigs: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfigContext = () => {
    const context = useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfigContext must be used within a ConfigProvider');
    }
    return context;
};

interface ConfigProviderProps {
    children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
    const [configs, setConfigs] = useState<ConfigItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConfigs = async (params: ConfigQueryParams = {
        search: '',
        sort: 'key',
        sortDir: 0,
        skip: 0,
        take: 100
    }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await configService.getAllConfigs(params);
            const configsData = response.result || [];
            setConfigs(configsData);
            sessionStorageUtils.saveConfigs(configsData);

        } catch (err) {
            console.error('Failed to fetch configs:', err);
            setError('Failed to load configuration');
        } finally {
            setLoading(false);
        }
    };

    const getConfigByKey = (key: string): string | null => {
        const config = configs.find(c => c.key === key);
        return config?.value || null;
    };

    const refreshConfigs = async () => {
        await fetchConfigs();
    };

    useEffect(() => {
        // Kiểm tra session storage trước
        const storedConfigs = sessionStorageUtils.getConfigs();
        if (storedConfigs) {
            setConfigs(storedConfigs);
        } else {
            // Nếu không có trong session storage, fetch từ API
            fetchConfigs();
        }
    }, []);

    const value: ConfigContextType = {
        configs,
        loading,
        error,
        getConfigByKey,
        refreshConfigs,
    };

    return (
        <ConfigContext.Provider value={value}>
            {children}
        </ConfigContext.Provider>
    );
}; 