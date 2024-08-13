"use client";
import useSWR from "swr";
import http from "@/lib/axios";
import { AccountsResponse } from "../interfaces/accountsDto";

export function useAccount() {
  const accountFetcher = (url: string) => http.get(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR<AccountsResponse>(
    "/api/accounts",
    accountFetcher
  );
  return {
    accounts: data?.accounts,
    isLoading,
    isError: error,
  };
}
