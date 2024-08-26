export interface LocationResponse {
    locations: Location[]
    message: string
}

export interface Location {
    id: number
    name: string
    user_id: number
    created_at: string
    updated_at: string
    status: number
}
