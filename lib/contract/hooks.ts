"use client";

import { useReadContract } from "wagmi";
import contractABI from "@/misc/generated/contract_abi";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function useIsMainAdmin(address?: `0x${string}`) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "getMainAdmin",
  });

  //   console.log(address == data);
  return { isMainAdmin: address == data, isLoading };
}

export function useIsUniversityAdmin(address?: `0x${string}`) {
  const { data: isRegistered, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "isUniversityRegistered",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        !!CONTRACT_ADDRESS &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  return {
    isUniversityAdmin: isRegistered as boolean,
    isLoading,
  };
}

export function useGetMainAdmin() {
  const { data: mainAdmin } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "getMainAdmin",
    query: {
      enabled:
        !!CONTRACT_ADDRESS &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  return mainAdmin as `0x${string}` | undefined;
}

export function useGetUniversityInfo(address?: `0x${string}`) {
  const { data, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "getUniversityInfo",
    args: address ? [address] : undefined,
    query: {
      enabled:
        !!address &&
        !!CONTRACT_ADDRESS &&
        CONTRACT_ADDRESS !== "0x0000000000000000000000000000000000000000",
    },
  });

  return {
    universityName: (data as [string, boolean])?.[0] || "",
    isRegistered: (data as [string, boolean])?.[1] || false,
    isLoading,
  };
}
