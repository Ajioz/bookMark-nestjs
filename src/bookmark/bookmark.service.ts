import { Injectable, ForbiddenException, HttpStatus } from '@nestjs/common';
import { BookMarkDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    getBokmarks(userId:number){
        return this.prisma.bookmark.findMany({ where:{
            userId,
        }})
    }


    getBokmarkById(userId:number, bookmarkId:number){
        return this.prisma.bookmark.findFirst({
            where:{
                id:bookmarkId,
                userId
            },
        });
    }   

 
    async createBookmark(
        userId:number, 
        bookmarkDTO: BookMarkDTO
        ){
            const bookmark = await this.prisma.bookmark.create({
                data:{
                    userId,
                    ...bookmarkDTO
                }
            })
            return bookmark;
    }


   async  editBokmarkById(
        userId:number, 
        bookmarkId:number, 
        bookmarkDTO: BookMarkDTO
        ){
            const bookmark = await this.prisma.bookmark.findUnique({
                where :{
                    id: bookmarkId
                }
            })
            if(!bookmark || bookmark.userId !== userId) throw new ForbiddenException('Access to resources denied');
            return this.prisma.bookmark.update({
                where:{
                    id: bookmarkId,
                },
                data:{
                    ...bookmarkDTO
                }
            })
    }


    async deleteBokmarkById(
        userId:number, 
        bookmarkId:number
        ){
            const bookmark = await this.prisma.bookmark.findUnique({
                where :{
                    id: bookmarkId
                }
            })
            if(!bookmark || bookmark.userId !== userId) throw new ForbiddenException('Access to resources denied');
            return this.prisma.bookmark.delete({
                where:{
                    id: bookmarkId,
                },
            })
    }
}
