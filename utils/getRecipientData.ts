import { User } from "firebase/auth";
import { UserProps } from "./typings";

export const getRecipientData = (users: string[], userLoggedIn: User): string => {
return users.filter((user) => user !== userLoggedIn?.email)[0] 
}