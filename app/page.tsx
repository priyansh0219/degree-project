"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useIsMainAdmin, useGetUniversityInfo } from "@/lib/contract/hooks";
import { Header } from "./components/Header";
import { WalletConnect } from "./components/WalletConnect";
import { MainAdminPage } from "./components/MainAdminPage";
import { UniversityAdminPage } from "./components/UniversityAdminPage";
import { VerifyDegreeTab } from "./components/VerifyDegreeTab";
import { SearchDegreesTab } from "./components/SearchDegreesTab";
import { IssueDegreeTab } from "./components/IssueDegreeTab";
import { ContractInfo } from "./components/ContractInfo";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { isMainAdmin, isLoading: isLoadingAdmin } = useIsMainAdmin(address);
  const {
    universityName,
    isRegistered: isUniversityAdmin,
    isLoading: isLoadingUniversity,
  } = useGetUniversityInfo(address);
  const [activeTab, setActiveTab] = useState<"issue" | "verify" | "search">(
    "verify",
  );

  const isLoading = isLoadingAdmin || isLoadingUniversity;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
      <Header />

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {!isConnected ? (
          <WalletConnect />
        ) : isLoading ? (
          <div className='flex items-center justify-center min-h-[60vh]'>
            <div className='text-center'>
              <div className='w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-gray-600 dark:text-gray-400'>
                Checking permissions...
              </p>
            </div>
          </div>
        ) : isMainAdmin ? (
          <MainAdminPage />
        ) : isUniversityAdmin && universityName ? (
          <UniversityAdminPage universityName={universityName} />
        ) : (
          <div className='space-y-6'>
            {/* Tabs */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2'>
              <div className='flex gap-2'>
                <button
                  onClick={() => setActiveTab("verify")}
                  className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
                    activeTab === "verify"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Verify Degree
                </button>
                <button
                  onClick={() => setActiveTab("search")}
                  className={`flex-1 px-4 py-3 rounded-md font-medium transition-colors ${
                    activeTab === "search"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  Search Degrees
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8'>
              {activeTab === "verify" && <VerifyDegreeTab />}
              {activeTab === "search" && <SearchDegreesTab />}
            </div>

            <ContractInfo />
          </div>
        )}
      </main>
    </div>
  );
}
