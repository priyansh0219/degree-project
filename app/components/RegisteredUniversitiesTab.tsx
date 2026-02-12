"use client";

import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import CONTRACT_ABI from "@/misc/generated/contract_abi";

interface University {
  name: string;
  admin: string;
  degreeCount: number;
}

interface RegisteredUniversitiesTabProps {
  onViewDegrees: (universityAdmin: string) => void;
}

export function RegisteredUniversitiesTab({
  onViewDegrees,
}: RegisteredUniversitiesTabProps) {
  const publicClient = usePublicClient();
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      if (!publicClient) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const contractAddress = process.env
        .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

      try {
        // Get total degrees count
        const totalDegrees = (await publicClient.readContract({
          address: contractAddress,
          abi: CONTRACT_ABI,
          functionName: "getTotalDegrees",
        })) as bigint;

        const total = Number(totalDegrees);
        const universitiesMap = new Map<string, University>();

        // Fetch each degree to find universities
        for (let i = 1; i <= total; i++) {
          try {
            const result = (await publicClient.readContract({
              address: contractAddress,
              abi: CONTRACT_ABI,
              functionName: "getDegreeCertificateData",
              args: [BigInt(i)],
            })) as [
              bigint,
              string,
              string,
              string,
              string,
              bigint,
              boolean,
              `0x${string}`,
            ];

            const isValid = result[6];
            if (!isValid) continue;

            const universityAdmin = result[7];
            const universityName = result[4];

            if (!universitiesMap.has(universityAdmin)) {
              universitiesMap.set(universityAdmin, {
                name: universityName,
                admin: universityAdmin,
                degreeCount: 0,
              });
            }
            universitiesMap.get(universityAdmin)!.degreeCount++;
          } catch (error) {
            console.error(`Error fetching degree ${i}:`, error);
          }
        }

        setUniversities(Array.from(universitiesMap.values()));
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, [publicClient]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>Registered Universities</h2>
          <p className='text-gray-600 dark:text-gray-400'>
            View all registered university administrators
          </p>
        </div>
        <div className='bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center'>
          <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse'>
            <svg
              className='w-8 h-8 text-gray-400'
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
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            Loading Universities...
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Please wait while we fetch registered universities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>Registered Universities</h2>
          <p className='text-gray-600 dark:text-gray-400'>
            View all registered university administrators and their activity
          </p>
        </div>
        <div className='bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-lg'>
          <span className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
            {universities.length}
          </span>
          <span className='text-sm text-purple-700 dark:text-purple-300 ml-2'>
            {universities.length === 1 ? "University" : "Universities"}
          </span>
        </div>
      </div>

      {universities.length === 0 ? (
        <div className='bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-12 text-center'>
          <div className='w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-gray-400'
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
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            No Universities Registered Yet
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Register your first university to get started.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {universities.map((university) => (
            <div
              key={university.admin}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow'
            >
              <div className='p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center shrink-0'>
                    <svg
                      className='w-6 h-6 text-indigo-600 dark:text-indigo-400'
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
                  <span className='bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-1 rounded'>
                    Active
                  </span>
                </div>

                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
                  {university.name}
                </h3>

                <div className='space-y-3'>
                  <div>
                    <p className='text-xs text-gray-500 dark:text-gray-400 mb-1'>
                      Admin Address
                    </p>
                    <div className='flex items-center gap-2'>
                      <code className='text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded'>
                        {formatAddress(university.admin)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(university.admin)}
                        className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        title='Copy full address'
                      >
                        <svg
                          className='w-4 h-4'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className='pt-3 border-t border-gray-200 dark:border-gray-700'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-sm text-gray-600 dark:text-gray-400'>
                        Degrees Issued
                      </span>
                      <span className='text-lg font-bold text-indigo-600 dark:text-indigo-400'>
                        {university.degreeCount}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewDegrees(university.admin)}
                      className='w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2'
                    >
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                        />
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                        />
                      </svg>
                      View Degrees
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
