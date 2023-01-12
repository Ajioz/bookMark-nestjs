import { Injectable } from "@nestjs/common"

@Injectable()
export class AuthService{
    
    signup(){
        return { msg: "I just signed up" }
    }

    signin(){
        return { msg: "I just Signed In" }
    }

}