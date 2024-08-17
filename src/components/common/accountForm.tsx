import { useAccountGroups } from "@/hooks/swr";
import { Account } from "@/interfaces/accountsDto";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import http from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { AxiosResponse } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const AccountSchema = z.object({
  name: z.string().min(3),
  opening_balance: z.number(),
});

type AccountSchemaType = z.infer<typeof AccountSchema>;

export function AccountForm({
  account,
  account_group_id,
  onEmit
}: {
  account?: Account;
  account_group_id?: number;
  onEmit: (isSuccess: boolean, shouldClose: boolean) => void;
}) {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AccountSchemaType>({ resolver: zodResolver(AccountSchema) });

  let { accountGroups, isLoading, isError } = useAccountGroups();

  const onSubmit: SubmitHandler<AccountSchemaType> = (data) => {
    if (account) {
      Object.assign(data, { account_group_id: account.account_group_id })
      http
        .patch("/api/accounts/" + account.id, data)
        .then((response: AxiosResponse) => {
          console.log(response);
          onEmit(true, true);
        });
    } else {
      Object.assign(data, { account_group_id: account_group_id });
      http.post("/api/accounts", data).then((response: AxiosResponse) => {
        console.log(response);
        onEmit(true, true);
      });
    }
  };
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                className="col-span-3"
                required
                defaultValue={account?.name}
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opening_balance" className="text-right">
                Opening Balance
              </Label>
              <Input
                id="opening_balance"
                className="col-span-3"
                type="number"
                defaultValue={
                  account?.current_balance_type == "CR"
                    ? 0 - account.current_balance
                    : account?.current_balance
                }
                required
                {...register("opening_balance", { valueAsNumber: true })}
              />
              {errors.opening_balance && (
                <span className="text-red-500 text-sm">
                  {errors.opening_balance.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{account ? "Update" : "Save"}</Button>
            <Button onClick={() => onEmit(true, true)}>Close</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
