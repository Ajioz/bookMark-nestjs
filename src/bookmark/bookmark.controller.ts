import { Controller, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { Body, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common/decorators';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { BookmarkService } from './bookmark.service';
import { BookMarkDTO, EditBookMarkDTO } from './dto';
import { HttpCode } from '@nestjs/common/decorators';

@UseGuards(JwtGuard)
@Controller('api/bookmarks')
export class BookmarkController {
    constructor(
        private bookmarkService: BookmarkService
    ){}

    @Get()
    getBokmarks(@GetUser('id') userId:number){
        return this.bookmarkService.getBokmarks(userId)
    }

    @Get('/:id')
    getBokmarkById(
        @GetUser('id') userId:number,
        @Param('id', ParseIntPipe) bookmarkId: number
        ){
            return this.bookmarkService.getBokmarkById(
                userId,
                bookmarkId
            );
        }

    @Post()
    createBookmark(
        @GetUser('id') userId:number, 
        @Body() bookDTO: BookMarkDTO
        ){
            return this.bookmarkService.createBookmark(
                userId,
                bookDTO
            );
        }

    @Patch('/:id')
    editBokmarkById(
        @GetUser('id') userId:number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() editBookDTO: EditBookMarkDTO
        ){
            return this.bookmarkService.editBokmarkById(
                userId,
                bookmarkId,
                editBookDTO
            );
        }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('/:id')
    deleteBokmarkById(
        @GetUser('id') userId:number,
        @Param('id', ParseIntPipe) bookmarkId: number
        ){
            return this.bookmarkService.deleteBokmarkById(
                userId,
                bookmarkId
            );
        }
}
