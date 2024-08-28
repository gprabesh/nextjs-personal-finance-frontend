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
import { Transaction, TransactionEditResponse, TransactionObject, TransactionType } from "@/interfaces/transactionsDto";
import http from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import MultipleSelector from "../ui/multiselect";

const TransactionSchema = z.object({
  description: z.string().min(3),
  transaction_date: z.string(),
  amount: z.number(),
  charge: z.number(),
  wallet_id: z.string(),
  account_id: z.string(),
  location_id: z.string().nullable(),
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
  onEmit: () => void;
}) {
  let {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionSchemaType>({ resolver: zodResolver(TransactionSchema) });

  const form = useForm<TransactionSchemaType>({
    resolver: zodResolver(TransactionSchema), defaultValues: {
      description: "",
      transaction_date: (new Date()).toISOString(),
      location_id: null,
      people: [],
      account_id: undefined,
      wallet_id: undefined,
      amount: 0,
      charge: 0
    }
  });
  const fetchedAccounts = useAccount();
  let [normalAccounts, setNormalAccounts] = useState<Account[]>([]);
  let [assetAccounts, setAssetAccounts] = useState<Account[]>([]);
  let [transactionObj, setTransactionObj] = useState<TransactionObject>({
    description: "",
    transaction_date: (new Date()).toISOString(),
    location_id: null,
    people: [],
    account_id: 0,
    wallet_id: 0,
    amount: 0,
    charge: 0
  })
  let peopleResponse = usePeople();
  let locationResponse = useLocation();
  useEffect(() => {
    let sessionUser: User | undefined = JSON.parse(sessionStorage.getItem("currentUser") || '""');
    let tempAssetAccounts: Account[] = [];
    let tempNormalAccounts: Account[] = [];
    fetchedAccounts.accounts?.forEach((element) => {
      if (!(element.id == sessionUser?.transfer_charge_account_id)) {
        if ([1, 2].includes(element.account_group_id)) {
          tempNormalAccounts.push(element);
        }
        if (element.account_group_id == 3) {
          tempAssetAccounts.push(element);
        }
      }
    })
    setNormalAccounts(tempNormalAccounts);
    setAssetAccounts(tempAssetAccounts);
    if (transaction) {
      http.get<TransactionEditResponse>("/api/transactions/" + transaction.id + "/edit").then((response) => {
        setTransactionObj(response.data.transaction);
        Object.keys(response.data.transaction).forEach((key) => {
          setValue(key as keyof TransactionSchemaType, response.data.transaction[key as keyof TransactionSchemaType])
        })
      })
    }
  }, [fetchedAccounts.accounts, transaction, setValue]);

  const onSubmit: SubmitHandler<TransactionSchemaType> = (data) => {
    console.log(data);
    if (transaction) {
      Object.assign(data, { transaction_type_id: transaction.transaction_type_id })
      http
        .patch("/api/transactions/" + transaction.id, data)
        .then((response: AxiosResponse) => {
          onEmit();
        });
    } else {
      Object.assign(data, { transaction_type_id: transaction_type?.id });
      http.post("/api/transactions", data).then((response: AxiosResponse) => {
        onEmit();
      });
    }
  };
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="transaction-create-edit-form" aria-description="transaction-create-edit-form">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit" : "Add"} {transaction_type?.name || 'Transaction'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 items-center gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Amount" {...field} onChange={event => field.onChange(+event.target.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="charge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Charge</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Charge" {...field} onChange={event => field.onChange(+event.target.value)} />
                    </FormControl>
                    <FormDescription>
                      eg. transfer charge, exchange charge
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wallet_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a wallet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assetAccounts.map(element => <SelectItem key={"wallet_account" + element.id} value={element.id.toString()}>{element.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {normalAccounts.map(element => <SelectItem key={"account" + element.id} value={element.id.toString()}>{element.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationResponse.locations?.map(element => <SelectItem key={"location" + element.id} value={element.id.toString()}>{element.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="people"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>People</FormLabel>
                    <FormControl>
                      <select {...register("people")} multiple={true} defaultValue={field.value}>
                        {peopleResponse.people?.map(element => <option key={"people" + element.id} value={element.id}>{element.name}</option>)}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input
                        {...register("transaction_date")}
                        type="datetime-local"
                        defaultValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button onClick={() => onEmit()} className="float-right m-1">Close</Button>
              <Button type="submit" className="float-right m-1">{transaction ? "Update" : "Save"}</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog >
  );
}
