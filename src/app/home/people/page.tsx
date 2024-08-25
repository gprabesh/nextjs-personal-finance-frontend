"use client";
import { IndianRupeeIcon, ListFilter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount, useAccountGroups } from "@/hooks/swr";
import { Button } from "@/components/ui/button";
import { PlusCircle, PenBoxIcon } from "lucide-react";
import ActionBar from "@/components/common/actionBar";
import { AccountForm } from "@/components/common/accountForm";
import { useState } from "react";
import { Account, AccountGroup } from "@/interfaces/accountsDto";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";


export default function Accounts() {
  let { accounts, isLoading, isError } = useAccount();
  let accountGroups = useAccountGroups();
  let [dialogOpen, setDialogOpen] = useState(false);
  let [accountGroup, setAccountGroup] = useState<AccountGroup>();
  let [editAccount, setEditAccount] = useState<Account>();
  const handleAccountFormEvent = (isSuccess: boolean, shouldClose: boolean) => {
    if (shouldClose) {
      setDialogOpen(false);
      setEditAccount(undefined);
    }
  }
  const setEditAcc = (account: Account) => {
    setEditAccount(account);
    setDialogOpen(true);
  };
  const setCreateAccount = (accountGroup: AccountGroup) => {
    setEditAccount(undefined);
    setAccountGroup(accountGroup);
    setDialogOpen(true);
  };
  return (
    <>
      <ActionBar>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-7 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  New
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {accountGroups.accountGroups?.map((element) => <DropdownMenuCheckboxItem key={"transaction-type-dropdown" + element.id} onClick={() => setCreateAccount(element)}>
                {element.name}
              </DropdownMenuCheckboxItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ActionBar>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-5">
        {accounts?.map((element) => (
          <Card key={"account-" + element.id} x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {element.name}
              </CardTitle>
              <IndianRupeeIcon className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent className="flex justify-between">
              <div
                className={
                  "text-3xl font-bold " +
                  (element.current_balance_type == "CR"
                    ? "text-red-500"
                    : "text-green-500")
                }
              >
                {element.current_balance.toLocaleString() +
                  " " +
                  element.current_balance_type}
              </div>
              <div>
                <PenBoxIcon
                  onClick={() => setEditAcc(element)}
                  className="h-6 w-6 text-foreground cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {dialogOpen && <AccountForm onEmit={handleAccountFormEvent} accountGroup={accountGroup} account={editAccount}></AccountForm>}

    </>
  );
}
