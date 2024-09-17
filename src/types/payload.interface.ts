import { Role } from "@prisma/client";

export interface IPayload {
    email: string;
    role: Role;
}