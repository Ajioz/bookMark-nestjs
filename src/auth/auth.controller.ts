import { Controller, Post, Get, Body, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO, SignUpDTO } from './dto';

@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.CREATED)
    @Post('/signup')
    signup(@Body() signupDTO: SignUpDTO){
        return this.authService.signup(signupDTO);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/signin')
    signin(@Body() signinDTO: SignInDTO){
        return this.authService.signin(signinDTO)
    }

}