export interface QueryOptions{
    filter?: any,
    sort?:string,
    way?: 'asc' | 'desc',
    limit?:number,
    offset?:number
}