export interface PeopleResponse {
    people: People[]
    message: string
}

export interface People {
    id: number
    name: string
    user_id: number
    created_at: string
    updated_at: string
    status: number
}
export interface PeopleSelectResponse {
    people: SelectPeople[]
    message: string
}

export interface SelectPeople {
    value: string
    label: string
}
