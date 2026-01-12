'use client';

import React, { useState, useEffect } from 'react';
import { IDiary } from '@/models/Diary';
import { Save } from 'lucide-react';

interface EditorProps {
    diary: IDiary;
    onUpdate: (updated: IDiary) => void;
}

const Editor: React.FC<EditorProps> = ({ diary, onUpdate }) => {
    const [title, setTitle] = useState(diary.title);
    const [content, setContent] = useState(diary.content);
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when selected diary changes
    useEffect(() => {
        setTitle(diary.title);
        setContent(diary.content);
    }, [diary._id]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Optimistic update locally first
            onUpdate({ ...diary, title, content, date_modified: new Date() });
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    // Simple debounce for auto-save effect or just save on blur/change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title !== diary.title || content !== diary.content) {
                onUpdate({ ...diary, title, content });
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [title, content]);


    return (
        <div className="flex-1 h-full flex flex-col p-6 glass m-4 rounded-2xl shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-4 border-b border-gray-200/30 pb-2">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Entry Title..."
                    className="text-3xl font-bold bg-transparent border-none outline-none w-full placeholder-gray-400/50"
                />
                <div className="text-xs opacity-50 whitespace-nowrap">
                    {isSaving ? 'Saving...' : 'Saved'}
                </div>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dear Diary..."
                className="flex-1 w-full bg-transparent border-none outline-none resize-none text-lg leading-relaxed placeholder-gray-400/50 p-2"
                spellCheck={false}
            />

            <div className="mt-2 text-right opacity-40 text-xs">
                {content.length} characters
            </div>
        </div>
    );
};

export default Editor;
