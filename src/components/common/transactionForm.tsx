"use client"

import { useAccount, useAccountGroups } from "@/hooks/swr";
import { Account } from "@/interfaces/accountsDto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import { User } from "@/interfaces/authDto";
import { Transaction, TransactionType } from "@/interfaces/transactionsDto";

const TransactionSchema = z.object({
  description: z.string().min(3),
  amount: z.number(),
  wallet_id: z.number(),
  account_id: z.number(),
  charge: z.number(),
});

type TransactionSchemaType = z.infer<typeof TransactionSchema>;

export default function TransactionForm({
  transaction,
  transaction_type,
  onEmit
}: {
  transaction?: Transaction;
  transaction_type?: TransactionType,
  onEmit: (isSuccess: boolean) => void;
}) {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<TransactionSchemaType>({ resolver: zodResolver(TransactionSchema) });
  const fetchedAccounts = useAccount();

  let { accountGroups, isLoading, isError } = useAccountGroups();

  let [normalAccounts, setNormalAccounts] = useState<Account[]>([]);
  let [assetAccounts, setAssetAccounts] = useState<Account[]>([]);
  let [transferAccount, setTransferAccount] = useState<Account>();
  let [user, setUser] = useState<User>();
  useEffect(() => {
    let sessionUser: User | undefined = JSON.parse(sessionStorage.getItem("currentUser") || '""');
    setUser(sessionUser);
    let tempAssetAccounts: Account[] = [];
    let tempNormalAccounts: Account[] = [];
    fetchedAccounts.accounts?.forEach((element) => {
      if (element.account_group_id == sessionUser?.transfer_charge_account_id) {
        setTransferAccount(element);
      } else {
        if (element.account_group_id == 3) {
          tempAssetAccounts.push(element);
        }
        if (element.account_group_id == 1 || element.account_group_id == 2) {
          tempNormalAccounts.push(element);
        }
      }

    })
    setNormalAccounts(tempNormalAccounts);
    setAssetAccounts(tempAssetAccounts);
  }, [fetchedAccounts.accounts]);

  const onSubmit: SubmitHandler<TransactionSchemaType> = (data) => {
    // if (account) {
    //   Object.assign(data, { account_group_id: account.account_group_id })
    //   http
    //     .patch("/api/accounts/" + account.id, data)
    //     .then((response: AxiosResponse) => {
    //       console.log(response);
    //       onEmit(true, true);
    //     });
    // } else {
    //   Object.assign(data, { account_group_id: account_group_id });
    //   http.post("/api/accounts", data).then((response: AxiosResponse) => {
    //     console.log(response);
    //     onEmit(true, true);
    //   });
    // }
  };
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{transaction ? "Add" : "Edit"} {transaction_type?.name || 'Transaction'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening_balance" className="text-right">
                Amount
              </Label>
              <Input
                id="opening_balance"
                className="col-span-3"
                type="number"
                defaultValue="0"
                required
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <span className="text-red-500 text-sm">
                  {errors.amount.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Description
              </Label>
              <Textarea
                id="name"
                className="col-span-3"
                required
                {...register("description")}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Wallet
              </Label>
              <select id="wallet_id" {...register("wallet_id")}>
                {assetAccounts.map(element => <option key={"wallet_account" + element.id} value={element.id}>{element.name}</option>)}
              </select>
              {errors.wallet_id && (
                <span className="text-red-500 text-sm">
                  {errors.wallet_id.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Account
              </Label>
              <select id="wallet" {...register("account_id")}>
                {normalAccounts.map(element => <option key={"normal_account" + element.id} value={element.id}>{element.name}</option>)}
              </select>
              {errors.account_id && (
                <span className="text-red-500 text-sm">
                  {errors.account_id.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening_balance" className="text-right">
                Charge
              </Label>
              <Input
                id="opening_balance"
                className="col-span-3"
                type="number"
                defaultValue="0"
                required
                {...register("charge", { valueAsNumber: true })}
              />
              {errors.charge && (
                <span className="text-red-500 text-sm">
                  {errors.charge.message}
                </span>
              )}
            </div>

          </div>
          <DialogFooter>
            <Button type="submit">{transaction ? "Update" : "Save"}</Button>
            <Button onClick={() => onEmit(true)}>Close</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
