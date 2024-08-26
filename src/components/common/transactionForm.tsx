"use client"

import { useAccount, useLocation, usePeople } from "@/hooks/swr";
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
import http from "@/lib/axios";
import { AxiosResponse } from "axios";

const TransactionSchema = z.object({
  description: z.string().min(3),
  transaction_date: z.string(),
  amount: z.number(),
  charge: z.number(),
  wallet_id: z.number(),
  account_id: z.number(),
  location_id: z.number().nullable(),
  people: z.array(z.string()).min(0)
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
  let [normalAccounts, setNormalAccounts] = useState<Account[]>([]);
  let [assetAccounts, setAssetAccounts] = useState<Account[]>([]);
  let peopleResponse = usePeople();
  let locationResponse = useLocation();
  useEffect(() => {
    let sessionUser: User | undefined = JSON.parse(sessionStorage.getItem("currentUser") || '""');
    let tempAssetAccounts: Account[] = [];
    let tempNormalAccounts: Account[] = [];
    fetchedAccounts.accounts?.forEach((element) => {
      if (!(element.account_group_id == sessionUser?.transfer_charge_account_id)) {
        if (element.account_group_id == 3) {
          tempAssetAccounts.push(element);
        }
        if (element.account_group_id == 1) {
          tempNormalAccounts.push(element);
        }
        if (element.account_group_id == 2) {
          tempNormalAccounts.push(element);
        }
      }
    })
    setNormalAccounts(tempNormalAccounts);
    setAssetAccounts(tempAssetAccounts);
  }, [fetchedAccounts.accounts]);

  const onSubmit: SubmitHandler<TransactionSchemaType> = (data) => {
    if (transaction) {
      Object.assign(data, { transaction_type_id: transaction.transaction_type_id })
      http
        .patch("/api/transactions/" + transaction.id, data)
        .then((response: AxiosResponse) => {
          onEmit(true);
        });
    } else {
      Object.assign(data, { transaction_type_id: transaction_type?.id });
      http.post("/api/transactions", data).then((response: AxiosResponse) => {
        onEmit(true);
      });
    }
  };
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{transaction ? "Edit" : "Add"} {transaction_type?.name || 'Transaction'}</DialogTitle>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Wallet
              </Label>
              <select id="wallet_id" {...register("wallet_id", { valueAsNumber: true })}>
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
              <select id="account" {...register("account_id", { valueAsNumber: true })}>
                {normalAccounts.map(element => <option key={"normal_account" + element.id} value={element.id}>{element.name}</option>)}
              </select>
              {errors.account_id && (
                <span className="text-red-500 text-sm">
                  {errors.account_id.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Location
              </Label>
              <select id="location" {...register("location_id", { valueAsNumber: true })}>
                <option value={undefined}>--Select Location--</option>
                {locationResponse.locations?.map(element => <option key={"location" + element.id} value={element.id}>{element.name}</option>)}
              </select>
              {errors.location_id && (
                <span className="text-blue-500 text-sm">
                  {errors.location_id.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                People
              </Label>
              <select id="people" {...register("people")} multiple={true}>
                {peopleResponse.people?.map(element => <option key={"people" + element.id} value={element.id}>{element.name}</option>)}
              </select>
              {errors.people && (
                <span className="text-green-500 text-sm">
                  {errors.people.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening_balance" className="text-right">
                Date
              </Label>
              <Input
                id="opening_balance"
                className="col-span-3"
                type="datetime-local"
                required
                {...register("transaction_date")}
              />
              {errors.transaction_date && (
                <span className="text-red-500 text-sm">
                  {errors.transaction_date.message}
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
