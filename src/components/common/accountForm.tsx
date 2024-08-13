import { Account } from "@/app/interfaces/accountsDto";
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
import { AxiosResponse } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const AccountSchema = z.object({
  name: z.string().min(3),
  opening_balance: z.number(),
});

type AccountSchemaType = z.infer<typeof AccountSchema>;

export function AccountForm({
  isOpen = false,
  account,
}: {
  isOpen: boolean;
  account?: Account;
}) {
  let {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AccountSchemaType>({ resolver: zodResolver(AccountSchema) });

  const onSubmit: SubmitHandler<AccountSchemaType> = (data) => {
    if (account) {
      http
        .patch("/api/accounts/" + account.id, data)
        .then((response: AxiosResponse) => {
          console.log(response);
          isOpen = false;
        });
    } else {
      Object.assign(data, { account_group_id: 3 });
      http.post("/api/accounts", data).then((response: AxiosResponse) => {
        console.log(response);
        isOpen = false;
      });
    }
  };
  return (
    <Dialog open={isOpen}>
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
                value={account?.name}
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
                defaultValue="0"
                className="col-span-3"
                type="number"
                value={
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
