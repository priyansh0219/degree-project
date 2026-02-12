"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import contractABI from "@/misc/generated/contract_abi";
import { AllDegreesTab } from "./AllDegreesTab";
import { RegisteredUniversitiesTab } from "./RegisteredUniversitiesTab";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

type Tab = "register" | "universities" | "degrees";

export function MainAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("register");
  const [universityAddress, setUniversityAddress] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [selectedUniversityFilter, setSelectedUniversityFilter] = useState<
    string | undefined
  >(undefined);

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

  const handleViewDegrees = (universityAdmin: string) => {
    setSelectedUniversityFilter(universityAdmin);
    setActiveTab("degrees");
  };

  return (
    <div className='space-y-6'>
      <div className='bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shrink-0'>
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

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
        {/* Tab Navigation */}
        <div className='border-b border-gray-200 dark:border-gray-700'>
          <nav className='flex -mb-px'>
            <button
              onClick={() => setActiveTab("register")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "register"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
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
                Register University
              </div>
            </button>
            <button
              onClick={() => setActiveTab("universities")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "universities"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
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
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
                Registered Universities
              </div>
            </button>
            <button
              onClick={() => setActiveTab("degrees")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "degrees"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400"
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
                View All Degrees
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className='p-8'>
          {activeTab === "register" && (
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  Register University
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  Add a new university admin who can issue degrees on behalf of
                  their institution.
                </p>
              </div>

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
                      <li>
                        Only registered university admins can issue degrees
                      </li>
                      <li>
                        Make sure the wallet address is correct before
                        registering
                      </li>
                      <li>Each university can only be registered once</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "universities" && (
            <RegisteredUniversitiesTab onViewDegrees={handleViewDegrees} />
          )}

          {activeTab === "degrees" && (
            <AllDegreesTab
              initialSelectedUniversity={selectedUniversityFilter}
            />
          )}
        </div>
      </div>
    </div>
  );
}
