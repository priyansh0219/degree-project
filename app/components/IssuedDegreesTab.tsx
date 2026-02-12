"use client";

import { useState, useEffect } from "react";
import { useAccount, usePublicClient } from "wagmi";
import CONTRACT_ABI from "@/misc/generated/contract_abi";

interface IssuedDegreesTabProps {
  universityName: string;
}

interface Degree {
  degreeId: number;
  studentName: string;
  studentId: string;
  degreeName: string;
  issueDate: number;
}

export function IssuedDegreesTab({ universityName }: IssuedDegreesTabProps) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all degrees and filter by university
  useEffect(() => {
    const fetchDegrees = async () => {
      if (!publicClient || !address) {
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
        const fetchedDegrees: Degree[] = [];

        // Fetch each degree and filter by current university admin
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

            // result: [degreeId, studentName, studentId, degreeName, universityName, issueDate, isValid, universityAdmin]
            const universityAdmin = result[7];
            const isValid = result[6];

            if (
              universityAdmin.toLowerCase() === address.toLowerCase() &&
              isValid
            ) {
              fetchedDegrees.push({
                degreeId: Number(result[0]),
                studentName: result[1],
                studentId: result[2],
                degreeName: result[3],
                issueDate: Number(result[5]),
              });
            }
          } catch (error) {
            console.error(`Error fetching degree ${i}:`, error);
          }
        }

        setDegrees(fetchedDegrees);
      } catch (error) {
        console.error("Error fetching degrees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDegrees();
  }, [publicClient, address]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>Issued Degrees</h2>
          <p className='text-gray-600 dark:text-gray-400'>
            View all degrees issued by {universityName}
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
            Loading Degrees...
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Please wait while we fetch the issued degrees.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-2xl font-bold mb-2'>Issued Degrees</h2>
        <p className='text-gray-600 dark:text-gray-400'>
          View all degrees issued by {universityName}
        </p>
      </div>

      {degrees.length === 0 ? (
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
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            No Degrees Issued Yet
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Degrees issued by your university will appear here.
          </p>
        </div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-900/50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                >
                  Degree ID
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                >
                  Student Name
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                >
                  Student ID
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                >
                  Degree Name
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                >
                  Issue Date
                </th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
              {degrees.map((degree) => (
                <tr
                  key={degree.degreeId}
                  className='hover:bg-gray-50 dark:hover:bg-gray-700/50'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'>
                    #{degree.degreeId}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
                    {degree.studentName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                    {degree.studentId}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
                    {degree.degreeName}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                    {formatDate(degree.issueDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='text-sm text-gray-600 dark:text-gray-400'>
        Total degrees issued:{" "}
        <span className='font-semibold'>{degrees.length}</span>
      </div>
    </div>
  );
}
