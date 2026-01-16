"use client";

import React, { useEffect, useState } from "react";
import { IDiary } from "@/models/Diary";
import { ArrowDownFromLine, Menu, Plus, Search, Trash2, X } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(true);
  const [displayedDiaries, setDisplayedDiaries] = useState(diaries);

  // console.log({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    setDisplayedDiaries(diaries.sort((a, b) => (
      new Date(b.date_created).getTime() -
      new Date(a.date_created).getTime()
    ))
  )
  }, [diaries]);

  const handleSortDiaries = (value: string) => {
    if (!value) {
      return;
    }
    const sorted = [...displayedDiaries].sort((a, b) => {
      switch (value) {
        case "date-down": //new to old
          return (
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
          );
        case "date-up": // old to new
          return (
            new Date(a.date_created).getTime() -
            new Date(b.date_created).getTime()
          );
        case "length-down":
          return b.content.length - a.content.length;
        case "length-up":
          return a.content.length - b.content.length;
        default:
          return (
            new Date(b.date_created).getTime() -
            new Date(a.date_created).getTime()
          );
      }
    });
    setDisplayedDiaries(sorted);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 ml-4 p-3 rounded-full bg-(--text-color)/15 hover:bg-(--text-color)/20 cursor-pointer"
        title="Open Sidebar"
      >
        <Menu size={24} />
      </button>
    );
  }

  return (
    <div className="w-80 h-full flex flex-col border-r border-(--text-color)/50 ">
      <div className="p-4 border-b-2 border-(--text-color)/50 flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Diaries</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-full hover:bg-(--text-color)/20 transition-colors cursor-pointer"
          title="Close Sidebar"
        >
          <X size={25} />
        </button>
      </div>
      {isLoading ? (
        <div className="h-full flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="p-4 border-b-2 border-(--text-color)/50 flex justify-between items-center">
            <select
              onChange={(e) => {
                handleSortDiaries(e.target.value);
              }}
              className="p-2 border outline-none rounded-md"
              name="sort"
              defaultValue="date-down"
              id="sort-by"
            >
              <option className="bg-black text-white" value="date-down" title="Date: New-Old">
                Date Created ↓
              </option>
              <option className="bg-black text-white" value="date-up" title="Date: Old-New">
                Date Created ↑
              </option>
              <option className="bg-black text-white" value="length-down" title="Length: Long-Short">
                Length ↓
              </option>
              <option className="bg-black text-white" value="length-up" title="Length: Short-Long">
                Length ↑
              </option>
            </select>
            <button
              onClick={onNew}
              className="p-2 rounded-full hover:bg-(--text-color)/20 transition-colors cursor-pointer"
              title="New Entry"
            >
              <Plus size={25} />
            </button>
          </div>

          <div className="p-2 pt-5 overflow-y-auto flex-1 sidebar-scroll ">
            {displayedDiaries.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-4 opacity-50 text-md">
                No entries yet. Click + to start.
              </div>
            ) : (
              displayedDiaries.map((diary) => (
                <div
                  key={diary._id}
                  onClick={() => onSelect(diary._id!)}
                  className={`bg-(--text-color)/10 p-3 mb-2 rounded-lg cursor-pointer transition-all hover:bg-(--text-color)/15 group flex justify-between items-center ${
                    selectedId == diary._id
                      ? "bg-(--text-color)/40 hover:bg-(--text-color)/40 font-medium"
                      : ""
                  }`}
                >
                  <div className="flex-1 truncate">
                    <h3 className="truncate text-sm font-semibold">
                      {diary.title || "Untitled Entry"}
                    </h3>
                    <p className="text-xs opacity-60 truncate">
                      {new Date(diary.date_created).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => onDelete(e, diary._id!)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 rounded text-red-500 transition-all"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
