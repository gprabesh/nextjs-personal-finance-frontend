"use client";

import { AccountForm } from "@/components/common/accountForm";
import { useEffect, useState } from "react";
import http from "@/lib/axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "./wallets";

export default function Wallets() {
  const [accounts, setAccounts] = useState([])
  useEffect(() => {
    http.get('/api/accounts').then((response) => {
      setAccounts(response.data.accounts);
    });

  }, []);
  return (
    <>
      <AccountForm></AccountForm>
      {accounts.map((element: Account) => <Card x-chunk="dashboard-05-chunk-1" key={'account-card' + element.id}>
        <CardHeader className="pb-2">
          <CardDescription className="text-xl">{element.name}</CardDescription>
          <CardTitle className={'text-4xl' + (element.current_balance_type == 'CR' ? 'text-red-400 dark:text-red-400' : 'text-green-400 dark:text-green-400')}>{'Rs. ' + element.current_balance.toLocaleString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl text-muted-foreground float-right">
            {element.current_balance_type}
          </div>
        </CardContent>
        <CardFooter>
        </CardFooter>
      </Card>)}

    </>
  );
}
