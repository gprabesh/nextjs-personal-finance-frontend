"use client"

import { TransactionDetail } from "@/interfaces/transactionsDto"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<TransactionDetail>[] = [
    {
        accessorKey: "transaction.description",
        header: "Description",
    },
    {
        accessorKey: "transaction_date",
        header: "Date",
    },
    {
        accessorKey: "account.name",
        header: "Wallet",
    },
    {
        accessorKey: "transaction.transaction_type.name",
        header: "Type",
    },
    {
        accessorKey: "transaction.amount",
        header: "Amount",
    },
]
