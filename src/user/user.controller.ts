import { Controller, Get, UseGuards, Patch, Body } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client'
import { UserDTO } from './dto';
import { UserService } from './user.service';


@UseGuards(JwtGuard)
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService){}

    @Get('')
    getUsers(@GetUser() user: User){
        return user;
    }

    @Patch()
    editUser(
        @GetUser('id') userId: number, 
        @Body() userDTO: UserDTO
        ){
        return this.userService.editUser(userId, userDTO)
    }

}
