'use client';

import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { FeeStudent } from "@/types/fees";

type SearchMode = "name" | "id";

interface StudentSearchProps {
  students: FeeStudent[];
  onSelectStudent: (student: FeeStudent) => void;
  selectedStudentId?: string;
}

const StudentSearch: React.FC<StudentSearchProps> = ({
  students,
  onSelectStudent,
  selectedStudentId,
}) => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("name");
  const [isFocused, setIsFocused] = useState(false);

  const trimmedQuery = query.trim().toLowerCase();

  const filteredStudents = useMemo(() => {
    if (!trimmedQuery) return [];
    return students
      .filter((student) => {
        if (mode === "name") {
          return student.name.toLowerCase().includes(trimmedQuery);
        }
        return student.id.toLowerCase().includes(trimmedQuery);
      })
      .slice(0, 10);
  }, [students, trimmedQuery, mode]);

  const handleSelect = (student: FeeStudent) => {
    onSelectStudent(student);
    setQuery("");
    setIsFocused(false);
  };

  const showDropdown = isFocused && trimmedQuery.length > 0;

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Search Student
        </label>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Search by:</span>
          <div className="inline-flex rounded-full bg-gray-100 p-0.5 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => setMode("name")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                mode === "name"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Name
            </button>
            <button
              type="button"
              onClick={() => setMode("id")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                mode === "id"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Reg. ID
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 120);
          }}
          placeholder={
            mode === "name"
              ? "Start typing student name..."
              : "Enter registration ID..."
          }
          className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 pr-11 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-purple-500 dark:focus:ring-purple-500/30"
        />
        <Search className="absolute w-4 h-4 text-gray-400 right-3 top-1/2 -translate-y-1/2" />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          {filteredStudents.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No students found.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredStudents.map((student) => {
                const isSelected = student.id === selectedStudentId;
                return (
                  <li key={student.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(student)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-purple-50 dark:hover:bg-purple-950/40 ${
                        isSelected
                          ? "bg-purple-50 text-purple-900 dark:bg-purple-950/50 dark:text-purple-100"
                          : "text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">
                          {student.name}
                          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                            {student.class}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          Reg ID:{" "}
                          <span className="font-mono text-gray-800 dark:text-gray-100">
                            {student.id}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          Father: {student.fatherName}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentSearch;

