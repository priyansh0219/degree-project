"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contractABI from "@/misc/generated/contract_abi";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface IssueDegreeTabProps {
  universityName?: string;
}

export function IssueDegreeTab({ universityName }: IssueDegreeTabProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    degreeName: "",
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId || !formData.studentName || !formData.degreeName) {
      alert("Please fill in all fields");
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: "issueDegree",
        args: [formData.studentId, formData.studentName, formData.degreeName],
      });
    } catch (error) {
      console.error("Error issuing degree:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      studentName: "",
      degreeName: "",
    });
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
          Issue Degree
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          {universityName
            ? `Issue a new degree certificate on behalf of ${universityName}.`
            : "Issue a new degree certificate. Only authorized university admins can perform this action."}
        </p>
      </div>

      <form onSubmit={handleIssue} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Student ID
          </label>
          <input
            type='text'
            value={formData.studentId}
            onChange={(e) =>
              setFormData({ ...formData, studentId: e.target.value })
            }
            placeholder='Enter student ID'
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Student Name
          </label>
          <input
            type='text'
            value={formData.studentName}
            onChange={(e) =>
              setFormData({ ...formData, studentName: e.target.value })
            }
            placeholder='Enter student name'
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Degree Name
          </label>
          <input
            type='text'
            value={formData.degreeName}
            onChange={(e) =>
              setFormData({ ...formData, degreeName: e.target.value })
            }
            placeholder='Enter degree name (e.g., Bachelor of Science in Computer Science)'
            className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
            required
          />
        </div>

        <button
          type='submit'
          disabled={isPending || isConfirming}
          className='w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors'
        >
          {isPending || isConfirming ? (
            <span className='flex items-center justify-center gap-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              {isPending ? "Confirm in wallet..." : "Processing..."}
            </span>
          ) : (
            "Issue Degree"
          )}
        </button>
      </form>

      {error && (
        <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <p className='text-sm text-red-800 dark:text-red-300'>
            <strong>Error:</strong> {error.message}
          </p>
        </div>
      )}

      {isSuccess && (
        <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
          <div className='flex items-start gap-3'>
            <svg
              className='w-5 h-5 text-green-600 dark:text-green-400 mt-0.5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <div className='flex-1'>
              <p className='text-sm font-semibold text-green-800 dark:text-green-300 mb-1'>
                ✓ Degree issued successfully!
              </p>
              <p className='text-sm text-green-700 dark:text-green-400'>
                Transaction: {hash?.slice(0, 10)}...{hash?.slice(-8)}
              </p>
              <button
                onClick={resetForm}
                className='mt-2 text-sm text-green-700 dark:text-green-400 underline hover:no-underline'
              >
                Issue another degree
              </button>
            </div>
          </div>
        </div>
      )}

      <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
        <div className='flex items-start gap-3'>
          <svg
            className='w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
          <div>
            <p className='text-sm text-yellow-800 dark:text-yellow-300'>
              Only registered university administrators can issue degrees.
              Ensure you're connected with the correct wallet address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
