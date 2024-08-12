import http from "@/lib/axios";
import { AxiosResponse } from "axios";

export interface Accounts {
    accounts: Account[]
    message: string
}
export interface Account {
    id: number
    name: string
    current_balance: number
    current_balance_type: string
    needs_balance_recalculation: number
    user_id: number
    account_group_id: number
    created_at: string
    updated_at: string
    status: number
}

export const fetchAccounts = async () => {
    try {
        const response: AxiosResponse<Accounts> = await http.get('/api/accounts');
        return response;
    } catch (error) {
        console.log(error);
    }
}
