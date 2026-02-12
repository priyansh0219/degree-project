"use client";

import { useState } from "react";

export function SearchDegreesTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<"name" | "id">("name");

  const handleSearch = async () => {
    alert(`Searching by ${searchType}: ${searchTerm}`);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Search Degrees
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Search for degrees by student name or student ID.
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Search Type
          </label>
          <div className='flex gap-4'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                checked={searchType === "name"}
                onChange={() => setSearchType("name")}
                className='w-4 h-4 text-indigo-600'
              />
              <span className='text-gray-700 dark:text-gray-300'>
                Student Name
              </span>
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='radio'
                checked={searchType === "id"}
                onChange={() => setSearchType("id")}
                className='w-4 h-4 text-indigo-600'
              />
              <span className='text-gray-700 dark:text-gray-300'>
                Student ID
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            {searchType === "name" ? "Student Name" : "Student ID"}
          </label>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              searchType === "name" ? "Enter student name" : "Enter student ID"
            }
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
          />
        </div>

        <button
          onClick={handleSearch}
          className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'
        >
          Search
        </button>
      </div>
    </div>
  );
}
