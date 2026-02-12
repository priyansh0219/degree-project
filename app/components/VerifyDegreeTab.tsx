"use client";

import { useState } from "react";

export function VerifyDegreeTab() {
  const [degreeId, setDegreeId] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    // TODO: Implement contract call
    alert("Contract integration pending. Degree ID: " + degreeId);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Verify Degree
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Enter a degree ID to verify its authenticity on the blockchain.
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Degree ID
          </label>
          <input
            type='number'
            value={degreeId}
            onChange={(e) => setDegreeId(e.target.value)}
            placeholder='Enter degree ID (e.g., 1)'
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
          />
        </div>

        <button
          onClick={handleVerify}
          className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'
        >
          Verify Degree
        </button>
      </div>

      {result && (
        <div className='mt-6 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
          <h3 className='font-semibold text-green-900 dark:text-green-200 mb-2'>
            Verification Result
          </h3>
          <div className='space-y-1 text-sm text-green-800 dark:text-green-300'>
            <p>Result data will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}
