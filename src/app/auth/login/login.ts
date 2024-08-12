export interface LoginResponse {
  message: string;
  data: Data;
}

interface Data {
  user: User;
  token: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  email_verified_at: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  opening_balance_account_id: number;
  transfer_charge_account_id: number;
}
