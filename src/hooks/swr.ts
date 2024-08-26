"use client";
import useSWR from "swr";
import http from "@/lib/axios";
import { AccountGroupsResponse, AccountsResponse } from "@/interfaces/accountsDto";
import { TransactionResponse, TransactionTypeResponse } from "@/interfaces/transactionsDto";
import { PeopleResponse } from "@/interfaces/peopleDto";
import { LocationResponse } from "@/interfaces/locationDto";

export function useAccount(account_group_id = []) {
  const accountFetcher = (url: string, account_group_id?: number[]) => http.get(url, {
    params: {
      account_group_id: account_group_id
    }
  }).then((res) => res.data);

  const { data, error, isLoading } = useSWR<AccountsResponse>(
    "/api/accounts" + account_group_id.toString(),
    (() => accountFetcher("/api/accounts", account_group_id))
  );
  return {
    accounts: data?.accounts,
    isLoading,
    isError: error,
  };
}

export function useAccountGroups() {
  const accountGroupFetcher = (url: string) => http.get(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR<AccountGroupsResponse>(
    "/api/common/account-groups",
    accountGroupFetcher
  );
  return {
    accountGroups: data?.accountGroups,
    isLoading,
    isError: error,
  };
}

export function useTransactions(account_id?: number) {
  const transactionsFetcher = (url: string, account_id?: number) => http.get(url, {
    params: {
      account_id: account_id,
      accountGroupIds: [3]
    }
  }).then((res) => res.data);

  const { data, error, isLoading } = useSWR<TransactionResponse>(
    "/api/transactions" + account_id,
    (() => transactionsFetcher("/api/transactions", account_id))
  );
  return {
    transactionDetails: data?.transactionDetails,
    isLoading,
    isError: error,
  };
}
export function useTransactionTypes() {
  const transactionTypeFetcher = (url: string) => http.get(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR<TransactionTypeResponse>(
    "/api/common/transaction-types",
    transactionTypeFetcher
  );
  return {
    transactionTypes: data?.transactionTypes,
    isLoading,
    isError: error,
  };
}
export function usePeople() {
  const peopleFetcher = (url: string) => http.get(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR<PeopleResponse>(
    "/api/people",
    peopleFetcher
  );
  return {
    people: data?.people,
    isLoading,
    isError: error,
  };
}
export function useLocation() {
  const locationFetcher = (url: string) => http.get(url).then((res) => res.data);

  const { data, error, isLoading } = useSWR<LocationResponse>(
    "/api/locations",
    locationFetcher
  );
  return {
    locations: data?.locations,
    isLoading,
    isError: error,
  };
}

