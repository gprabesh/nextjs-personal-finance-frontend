export interface Accounts {
  message: string;
  data: Data;
}

export interface Data {
  accounts: Account[];
}

export interface Account {
  id: number;
  name: string;
  current_balance: number;
  current_balance_type: string;
  needs_balance_recalculation: number;
  user_id: number;
  account_group_id: number;
  created_at: string;
  updated_at: string;
  status: number;
}
