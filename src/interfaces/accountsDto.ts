export interface AccountsResponse {
  accounts: Account[];
  message: string;
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

export interface AccountGroupsResponse {
  accountGroups: AccountGroup[]
  message: string
}

export interface AccountGroup {
  id: number
  name: string
  code: string
  created_at: string
  updated_at: string
  status: number
}

