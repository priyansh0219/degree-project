"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contractABI from "@/misc/generated/contract_abi";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function MainAdminPage() {
  const [universityAddress, setUniversityAddress] = useState("");
  const [universityName, setUniversityName] = useState("");

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleRegisterUniversity = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!universityAddress || !universityName) {
      alert("Please fill in all fields");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "registerUniversity",
        args: [universityAddress as `0x${string}`, universityName],
      });
    } catch (error) {
      console.error("Error registering university:", error);
      alert("Error registering university. Check console for details.");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0'>
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
                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              />
            </svg>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-purple-900 dark:text-purple-200 mb-1'>
              Main Administrator
            </h3>
            <p className='text-sm text-purple-700 dark:text-purple-300'>
              You are the main admin of this contract. You can register
              universities and manage the system.
            </p>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Register University
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          Add a new university admin who can issue degrees on behalf of their
          institution.
        </p>

        <form onSubmit={handleRegisterUniversity} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              University Admin Address
            </label>
            <input
              type='text'
              value={universityAddress}
              onChange={(e) => setUniversityAddress(e.target.value)}
              placeholder='0x...'
              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              required
            />
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              The wallet address of the university administrator
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              University Name
            </label>
            <input
              type='text'
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder='e.g., Harvard University'
              className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
              required
            />
          </div>

          <button
            type='submit'
            disabled={isPending || isConfirming}
            className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors'
          >
            {isPending || isConfirming
              ? "Processing..."
              : "Register University"}
          </button>

          {isSuccess && (
            <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <p className='text-sm text-green-800 dark:text-green-300'>
                ✓ University registered successfully! Transaction hash:{" "}
                {hash?.slice(0, 10)}...
              </p>
            </div>
          )}
        </form>
      </div>

      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-blue-900 dark:text-blue-200 mb-1'>
              Important Notes
            </h3>
            <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside'>
              <li>Only registered university admins can issue degrees</li>
              <li>
                Make sure the wallet address is correct before registering
              </li>
              <li>Each university can only be registered once</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
