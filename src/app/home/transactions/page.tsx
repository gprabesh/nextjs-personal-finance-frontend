"use client";

import { useAccount, useTransactions, useTransactionTypes } from "@/hooks/swr";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { PlusCircle, ListFilter } from "lucide-react";
import ActionBar from "@/components/common/actionBar";
import { useState } from "react";
import { Transaction, TransactionType } from "@/interfaces/transactionsDto";
import TransactionForm from "@/components/common/transactionForm";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Accounts() {
  const transactions = useTransactions();
  const transactionTypes = useTransactionTypes();
  let [transactionType, setTransactionType] = useState<TransactionType>();
  let [editTransaction, setEditTransaction] = useState<Transaction>();
  let [dialogOpen, setDialogOpen] = useState(false);

  const handleTransactionFormEvent = () => {
    setTransactionType(undefined);
    setEditTransaction(undefined);
    setDialogOpen(false);
  }
  const setTransaction = (transaction?: Transaction, transactionType?: TransactionType) => {
    setTransactionType(transactionType);
    setEditTransaction(transaction);
    setDialogOpen(true);
  }
  return (
    <>
      <ActionBar>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
          </TabsList>
        </Tabs>
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
              {transactionTypes.transactionTypes?.map((element) => <DropdownMenuCheckboxItem key={"transaction-type-dropdown" + element.id} onClick={() => setTransaction(undefined, element)}>
                {element.name}
              </DropdownMenuCheckboxItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ActionBar>
      <div className="container mx-auto py-10">
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.transactionDetails?.data.map((transactionDetail) => (
              <TableRow key={transactionDetail.id} onClick={() => setTransaction(transactionDetail.transaction, transactionDetail.transaction.transaction_type)}>
                <TableCell >{transactionDetail.transaction.description}</TableCell>
                <TableCell>{transactionDetail.transaction_date}</TableCell>
                <TableCell>{transactionDetail.account?.name}</TableCell>
                <TableCell>{transactionDetail.transaction.transaction_type.name}</TableCell>
                <TableCell className="text-right">{transactionDetail.transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div >
      {dialogOpen && <TransactionForm transaction_type={transactionType} transaction={editTransaction} onEmit={handleTransactionFormEvent}></TransactionForm>}
    </>
  );
}
