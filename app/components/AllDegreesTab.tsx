"use client";

import { useState, useEffect } from "react";
import { usePublicClient } from "wagmi";
import CONTRACT_ABI from "@/misc/generated/contract_abi";

interface Degree {
  degreeId: number;
  studentName: string;
  studentId: string;
  degreeName: string;
  universityName: string;
  universityAdmin: string;
  issueDate: number;
}

interface UniversityGroup {
  universityName: string;
  universityAdmin: string;
  degrees: Degree[];
}

interface AllDegreesTabProps {
  initialSelectedUniversity?: string;
}

export function AllDegreesTab({
  initialSelectedUniversity,
}: AllDegreesTabProps = {}) {
  const publicClient = usePublicClient();
  const [universities, setUniversities] = useState<UniversityGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<string>(
    initialSelectedUniversity || "all",
  );

  useEffect(() => {
    const fetchAllDegrees = async () => {
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
        const degreesByUniversity = new Map<string, UniversityGroup>();

        // Fetch each degree
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
            const isValid = result[6];
            if (!isValid) continue;

            const universityAdmin = result[7];
            const universityName = result[4];

            const degree: Degree = {
              degreeId: Number(result[0]),
              studentName: result[1],
              studentId: result[2],
              degreeName: result[3],
              universityName: universityName,
              universityAdmin: universityAdmin,
              issueDate: Number(result[5]),
            };

            // Group by university
            if (!degreesByUniversity.has(universityAdmin)) {
              degreesByUniversity.set(universityAdmin, {
                universityName: universityName,
                universityAdmin: universityAdmin,
                degrees: [],
              });
            }
            degreesByUniversity.get(universityAdmin)!.degrees.push(degree);
          } catch (error) {
            console.error(`Error fetching degree ${i}:`, error);
          }
        }

        setUniversities(Array.from(degreesByUniversity.values()));
      } catch (error) {
        console.error("Error fetching degrees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDegrees();
  }, [publicClient]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const filteredUniversities =
    selectedUniversity === "all"
      ? universities
      : universities.filter((u) => u.universityAdmin === selectedUniversity);

  const totalDegrees = universities.reduce(
    (sum, u) => sum + u.degrees.length,
    0,
  );

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>All Degrees</h2>
          <p className='text-gray-600 dark:text-gray-400'>
            View all degrees issued across all universities
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
            Please wait while we fetch all degrees from the blockchain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between'>
        <div>
          <h2 className='text-2xl font-bold mb-2'>All Degrees</h2>
          <p className='text-gray-600 dark:text-gray-400'>
            View all degrees issued across all universities
          </p>
        </div>
        {universities.length > 1 && (
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white'
          >
            <option value='all'>All Universities</option>
            {universities.map((uni) => (
              <option key={uni.universityAdmin} value={uni.universityAdmin}>
                {uni.universityName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
          <div className='text-sm text-blue-600 dark:text-blue-400 font-medium mb-1'>
            Total Universities
          </div>
          <div className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
            {universities.length}
          </div>
        </div>
        <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
          <div className='text-sm text-green-600 dark:text-green-400 font-medium mb-1'>
            Total Degrees Issued
          </div>
          <div className='text-2xl font-bold text-green-900 dark:text-green-100'>
            {totalDegrees}
          </div>
        </div>
        <div className='bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4'>
          <div className='text-sm text-purple-600 dark:text-purple-400 font-medium mb-1'>
            Average per University
          </div>
          <div className='text-2xl font-bold text-purple-900 dark:text-purple-100'>
            {universities.length > 0
              ? Math.round(totalDegrees / universities.length)
              : 0}
          </div>
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
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>
            No Degrees Issued Yet
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Universities haven't issued any degrees yet. Register universities
            first.
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {filteredUniversities.map((university) => (
            <div
              key={university.universityAdmin}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'
            >
              {/* University Header */}
              <div className='bg-linear-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
                      {university.universityName}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400 font-mono'>
                      Admin: {formatAddress(university.universityAdmin)}
                    </p>
                  </div>
                  <div className='bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium'>
                    {university.degrees.length} Degree
                    {university.degrees.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Degrees Table */}
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
                    {university.degrees.map((degree) => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
