import { Controller, Post, Get, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService){}

    @Post('/signup')
    signup(@Body() signupDTO: SignUpDTO){
        return this.authService.signup(signupDTO);
    }


    @Post('/signin')
    signin(@Body() signinDTO: SignInDTO){
        return this.authService.signin(signinDTO)
    }

}