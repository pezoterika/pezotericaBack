import { PrismaClient, User } from "@prisma/client"

export class UserService {

    prisma = new PrismaClient;

    async create(_user: User) : Promise<User> {
        return this.prisma.user.create({
            data: _user
        })
    }
    
    async findAllUsers() : Promise<User[]> {
        return this.prisma.user.findMany()
    }


    async findById(_id: number) : Promise<User> {
        return this.prisma.user.findUnique({
            where: {
                id: _id
            }
        })
    }
    
    async update(_user: User) {
        return this.prisma.user.update({
            where: {
                id: _user.id
            },
            data: _user
        })
    }


    async updatePassword(_email: string, _password: string) {
        return this.prisma.user.update({
            where: {
                email: _email
            },
            data: {
                password: _password
            }
        })
    }

    async findByEmail(_email: string) :Promise<User> {
        return this.prisma.user.findFirst({
            where: {
                email: _email
            }
        })
    }

     async isExists(_user: User): Promise<boolean> {
        const user =  await this.findByEmail(_user.email);
        return user ? true : false;
    }
}