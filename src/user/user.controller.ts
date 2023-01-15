import { Controller, Get, UseGuards, Patch } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client'


@UseGuards(JwtGuard)
@Controller('api/users')
export class UserController {

    @Get('')
    getUsers(
        @GetUser() user: User,
        @GetUser('email') email: string,
        ){
            console.log({email})
        return user;
    }

    @Patch('/:userId')
    editUser(){
        return 'User edited'
    }

}
