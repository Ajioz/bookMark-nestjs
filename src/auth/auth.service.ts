import { ForbiddenException, Injectable } from "@nestjs/common"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from "../prisma/prisma.service";
import { SignUpDTO, SignInDTO } from "./dto"
import * as argon from 'argon2'
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ){}
    
    async signup(signupDTO: SignUpDTO){
        
        // generate the password hash
        const hash = await argon.hash(signupDTO.password);
        try {
        // save the new user in the db
        const user = await this.prisma.user.create({
            data : {
                email: signupDTO.email,
                firstName: signupDTO.firstName,
                lastName:signupDTO.lastName,
                hash,
            },
           /* select:{id:true, email: true, firstName:true, lastName:true, createdAt:true, }*/
            });
            delete user.hash;
            return user
            //  return {Status: "Success", Token: await this.signToken(user.id, user.email)};
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException('Credentials Taken')
                }
            }
            throw error;
        }
       
    }

    async signin(signinDTO: SignInDTO){
        try {
            
            // find user by email
            const user = await this.prisma.user.findUnique({
                where : {
                    email: signinDTO.email
                },
            });

            // if user does not exist thor exception
            if(!user) return {statusCode: 403, message: "No Such User!", error: "Forbidden"}

            // else compare password
            const passMatch = await argon.verify(user.hash, signinDTO.password);

            // if password is incorrect, throw exception
            if(!passMatch) return  {statusCode: 403, message: "Incorrect Password", error: "Forbidden"}

            // else return a token
            return {Status: "Success", access_token: await this.signToken(user.id, user.email)};

        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError ){
                if(error.code === "P1001") throw new ForbiddenException("Please check database server connection")
            }
        }
    }

   signToken(userId:number, email: string):Promise<string>{
    const payload = {
        sub: userId,
        email
    }
    return this.jwt.signAsync(payload, {
        expiresIn: '1d',
        secret: this.config.get('JWT_SECRET')
    })
   }
}

// "test:deploy": prisma:test:deploy",