'use client';

import React, { useState } from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Settings, X } from 'lucide-react';

const SettingsPanel = () => {
    const { settings, updateSettings } = useSettings();
    const [isOpen, setIsOpen] = useState(false);

    const gradients = [
        'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Cold
        'linear-gradient(120deg, #f6d365 0%, #fda085 100%)', // Warm
        'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)', // Cloud
        'linear-gradient(to right, #43e97b 0%, #38f9d7 100%)', // Mint
        'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)', // Magic
        'linear-gradient(to right, #243949 0%, #517fa4 100%)', // Night
    ];

    const fonts = [
        'sans-serif',
        'serif',
        'monospace',
        '"Courier New", Courier, monospace',
        '"Verdana", Geneva, sans-serif',
        '"Georgia", serif'
    ];

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 p-3 rounded-full bg-white/20 glass hover:bg-white/40 shadow-lg transition-all"
                title="Settings"
            >
                <Settings size={24} />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-80 h-full glass p-6 shadow-2xl animate-slide-in-right overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Appearance</h2>
                    <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-6">
                    <section>
                        <h3 className="font-semibold mb-3">Theme</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {gradients.map((g, i) => (
                                <div
                                    key={i}
                                    className={`h-12 rounded-lg cursor-pointer ring-2 ${settings.bgColor === g ? 'ring-blue-500' : 'ring-transparent'
                                        }`}
                                    style={{ background: g }}
                                    onClick={() => updateSettings({ bgColor: g })}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-3">Font Family</h3>
                        <select
                            value={settings.fontFamily}
                            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                            className="w-full p-2 rounded glass outline-none"
                        >
                            {fonts.map(font => (
                                <option key={font} value={font}>{font.replace(/"/g, '')}</option>
                            ))}
                        </select>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-3">Colors</h3>
                        <div className="space-y-2">
                            <label className="flex justify-between items-center text-sm">
                                Text Color
                                <input
                                    type="color"
                                    value={settings.textColor}
                                    onChange={(e) => updateSettings({ textColor: e.target.value })}
                                    className="cursor-pointer"
                                />
                            </label>
                            <label className="flex justify-between items-center text-sm">
                                Editor Background
                                <input
                                    type="color"
                                    value={settings.editorColor.includes('rgba') ? '#ffffff' : settings.editorColor} // Fallback for rgba
                                    onChange={(e) => updateSettings({ editorColor: e.target.value })}
                                    className="cursor-pointer"
                                />
                            </label>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
