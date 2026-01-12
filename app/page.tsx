'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import SettingsPanel from '@/components/SettingsPanel';
import { SettingsProvider } from '@/context/SettingsContext';
import { IDiary } from '@/models/Diary';

const DiaryApp = () => {
  const [diaries, setDiaries] = useState<IDiary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Diaries
  const fetchDiaries = async () => {
    try {
      const res = await fetch('/api/diaries');
      const data = await res.json();
      if (data.success) {
        setDiaries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch diaries', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  // Create New Diary
  const handleNewDiary = async () => {
    try {
      const res = await fetch('/api/diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '1', content: 'e' }),
      });
      const data = await res.json();
      if (data.success) {
        setDiaries([data.data, ...diaries]);
        setSelectedId(data.data._id);
      }
    } catch (error) {
      console.error('Failed to create diary', error);
    }
  };

  // Update Diary
  const handleUpdateDiary = async (updatedDiary: IDiary) => {
    // Optimistic update in list
    setDiaries((prev) =>
      prev.map((d) => (d._id === updatedDiary._id ? updatedDiary : d))
    );

    try {
      await fetch(`/api/diaries/${updatedDiary._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDiary),
      });
      // Optionally re-fetch to strict sync or just rely on local state if assumed success
    } catch (error) {
      console.error('Failed to update diary', error);
    }
  };

  // Delete Diary
  const handleDeleteDiary = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this diary?')) return;

    try {
      const res = await fetch(`/api/diaries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDiaries((prev) => prev.filter((d) => d._id !== id));
        if (selectedId === id) setSelectedId(null);
      }
    } catch (error) {
      console.error('Failed to delete diary', error);
    }
  };

  const selectedDiary = diaries.find((d) => d._id === selectedId);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        diaries={diaries}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onNew={handleNewDiary}
        onDelete={handleDeleteDiary}
      />

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {selectedDiary ? (
          <Editor diary={selectedDiary} onUpdate={handleUpdateDiary} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center opacity-40">
            <h1 className="text-4xl font-bold mb-4">My Diary</h1>
            <p>Select a diary from the sidebar or create a new one.</p>
          </div>
        )}
      </main>

      <SettingsPanel />
    </div>
  );
};

export default function Home() {
  return (
    <SettingsProvider>
      <DiaryApp />
    </SettingsProvider>
  );
}
