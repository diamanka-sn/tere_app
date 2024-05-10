import { User } from "./user";

export interface Book {
    id?: number | string;
    title: string;
    author: string;
    description: string;
    status:string;
    user?:User
}