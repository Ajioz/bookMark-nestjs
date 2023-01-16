import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { UserDTO } from './dto';


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    @HttpCode(HttpStatus.BAD_REQUEST)
    async editUser(userId: number, userDTO: UserDTO ){
        try {
            const user = await this.prisma.user.update({
                where: { id: userId },
                data:  { ...userDTO }
            });
            delete user.hash;   
            return user;        
        } catch (error) {
            return {message: "something went wrong", code: 400}
        }
    }
}
