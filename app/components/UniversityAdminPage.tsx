"use client";

import { useState } from "react";
import { IssueDegreeTab } from "./IssueDegreeTab";
import { IssuedDegreesTab } from "./IssuedDegreesTab";

interface UniversityAdminPageProps {
  universityName: string;
}

type Tab = "issue" | "issued";

export function UniversityAdminPage({
  universityName,
}: UniversityAdminPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>("issue");

  return (
    <div className='space-y-6'>
      <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-green-900 dark:text-green-200 mb-1'>
              University Administrator
            </h3>
            <p className='text-sm text-green-700 dark:text-green-300'>
              Logged in as:{" "}
              <span className='font-semibold'>{universityName}</span>
            </p>
            <p className='text-sm text-green-600 dark:text-green-400 mt-1'>
              You can issue and manage degrees on behalf of your institution.
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {/* Tab Navigation */}
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab("issue")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "issue"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
                Issue Degree
              </div>
            </button>
            <button
              onClick={() => setActiveTab("issued")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "issued"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <div className='flex items-center gap-2'>
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
                Issued Degrees
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className='p-8'>
          {activeTab === "issue" && (
            <IssueDegreeTab universityName={universityName} />
          )}
          {activeTab === "issued" && (
            <IssuedDegreesTab universityName={universityName} />
          )}
        </div>
      </div>
    </div>
  );
}
