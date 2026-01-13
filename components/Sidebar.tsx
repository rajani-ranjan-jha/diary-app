"use client";

import React from "react";
import { IDiary } from "@/models/Diary";
import { Plus, Search, Trash2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface SidebarProps {
  isLoading: Boolean;
  diaries: IDiary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isLoading,
  diaries,
  selectedId,
  onSelect,
  onNew,
  onDelete,
}) => {
  return (
    <div className="w-80 h-full flex flex-col border-r border-(--text-color)/50 ">
      <div className="p-4 border-b-2 border-(--text-color)/50 flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Diaries</h2>
        <button
          onClick={onNew}
          className="p-2 rounded-full hover:bg-(--text-color)/20 transition-colors cursor-pointer"
          title="New Entry"
        >
          <Plus size={25} />
        </button>
      </div>

      <div className="p-2 pt-5 overflow-y-auto flex-1 sidebar-scroll ">
        {isLoading ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : diaries.length === 0 ? (
          <div className="text-center p-4 opacity-50 text-sm">
            No entries yet. Click + to start.
          </div>
        ) : (
          diaries.map((diary) => (
            <div
              key={diary._id}
              onClick={() => onSelect(diary._id!)}
              className={`bg-white/20 p-3 mb-2 rounded-lg cursor-pointer transition-all hover:bg-(--text-color)/15 group flex justify-between items-center ${
                selectedId === diary._id
                  ? "bg-(--text-color)/10 font-medium"
                  : ""
              }`}
            >
              <div className="flex-1 truncate">
                <h3 className="truncate text-sm font-semibold">
                  {diary.title || "Untitled Entry"}
                </h3>
                <p className="text-xs opacity-60 truncate">
                  {new Date(diary.date_modified).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => onDelete(e, diary._id!)}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded text-red-500 transition-all"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
