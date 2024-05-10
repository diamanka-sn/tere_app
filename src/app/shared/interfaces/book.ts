import { User } from "./user";

export interface Book {
    id: number | string;
    title: string;
    author: string;
    description: Text;
    status:string;
    user:User
}