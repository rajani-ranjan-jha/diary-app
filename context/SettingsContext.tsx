'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Settings = {
    bgColor: string;
    textColor: string;
    editorColor: string;
    fontFamily: string;
};

type SettingsContextType = {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
    bgColor: 'radial-gradient(ellipse at bottom right, #0f172a, #1e1a78, #0f172a)',
    textColor: '#ffffff',
    editorColor: 'rgba(0, 0, 0, 0.1)',
    fontFamily: 'Poppins',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() => {
        const saved = localStorage.getItem('diary-settings');
        if (saved) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(saved) });
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('diary-settings', JSON.stringify(settings));
        document.documentElement.style.setProperty('--bg-gradient', settings.bgColor);
        document.documentElement.style.setProperty('--text-color', settings.textColor);
        document.documentElement.style.setProperty('--editor-color', settings.editorColor);
        document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    }, [settings]);

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
