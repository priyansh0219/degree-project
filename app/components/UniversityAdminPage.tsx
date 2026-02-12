"use client";

import { IssueDegreeTab } from "./IssueDegreeTab";

interface UniversityAdminPageProps {
  universityName: string;
}

export function UniversityAdminPage({
  universityName,
}: UniversityAdminPageProps) {
  return (
    <div className='space-y-6'>
      <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0'>
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
              You can issue degrees on behalf of your institution.
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
        <IssueDegreeTab universityName={universityName} />
      </div>
    </div>
  );
}
