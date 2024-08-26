export interface TransactionResponse {
    transactionDetails: TransactionDetailsList
    message: string
}

export interface TransactionDetailsList {
    current_page: number
    data: TransactionDetail[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Link[]
    next_page_url: any
    path: string
    per_page: number
    prev_page_url: any
    to: number
    total: number
}

export interface TransactionDetail {
    id: number
    debit: number
    credit: number
    transaction_date: string
    account_id: number
    account_balance: number
    account_balance_type: string
    transaction_id: number
    user_id: number
    created_at: string
    updated_at: string
    status: number
    transaction: Transaction
    account?: Account
}

export interface Transaction {
    id: number
    description: string
    transaction_date: string
    amount: number
    user_id: number
    transaction_type_id: number
    location_id: any | null
    parent_id: any | null
    created_at: string
    updated_at: string
    status: number
    transaction_type: TransactionType
}

export interface TransactionType {
    id: number
    name: string
    code: string
    created_at: string
    updated_at: string
    status: number
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

export interface Link {
    url?: string
    label: string
    active: boolean
}

export interface TransactionTypeResponse {
    transactionTypes: TransactionType[]
    message: string
}

export interface TransactionForm {
    description: string
    transaction_date: string
    amount: number
    transaction_type_id: number
    location_id: number | null
    parent_id: number | null
    transactionDetails: TransactionDetail[]
    people: number[]
}

export interface TransactionFormDetail {
    id?: number
    account_id: number
    debit: number
    credit: number
}

export interface TransactionEditResponse {
    transaction: TransactionObject
    message: string
}

export interface TransactionObject {
    description: string
    transaction_date: string
    location_id: number | null
    people: string[]
    transaction_type_id?: number
    account_id: number
    wallet_id: number
    amount: number
    charge: number
}

