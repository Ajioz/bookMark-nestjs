import { INestApplication, ValidationPipe } from '@nestjs/common';
import {Test} from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import { SignInDTO, SignUpDTO } from '../src/auth/dto';
import { setBaseUrl } from 'pactum/src/exports/request';
import { UserDTO } from '../src/user/dto';
import { BookMarkDTO, EditBookMarkDTO } from 'src/bookmark/dto';


describe('App e2e', () => {
  let app: INestApplication;
  let prisma:PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports:[AppModule],
    }).compile();
    
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  })
  
  describe('Auth', ()=> { 

    const signDto: SignUpDTO = {
      email: "john@gmail.com",
      password: "123456",
      firstName: 'John',
      lastName: 'Doe'
    };

    const signIn: SignInDTO = {
      email: "john@gmail.com",
      password: "123456",
    }

    describe('Signup', () => { 
      it('Should throw if empty email', ()=> {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          password: signDto.password,
          firstName: signDto.firstName,
          lastName: signDto.lastName
        })
        .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          email: signDto.email,
          firstName: signDto.firstName,
          lastName: signDto.lastName
        })
        .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
        .spec()
        .post('/auth/signup')
        .withBody(signDto)
        .expectStatus(201)
        .inspect()
      });
    });

    describe('Signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: signIn.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: signIn.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(signIn)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
    
  });

 describe('User', () => {
    describe('Get user', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/api/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      
      const userDto: UserDTO = {
        email: 'sunny@ajiozi.com',
        firstName: 'sunny',
        lastName: 'Ajioz'
      };

      it('should edit user', () => {
        return pactum
          .spec()
          .patch('/api/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(userDto)
          .expectStatus(200)
          .expectBodyContains(userDto.email)
          .expectBodyContains(userDto.firstName)
          .expectBodyContains(userDto.lastName);
      });
    });
  });


  describe('Bookmarks', ()=> {  
    describe('Get Empty Bookmarks', () => { 
      it('It should get bookmark', () => {
        return pactum
        .spec()
        .get('/api/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBody([])
      })
     })
    describe('Create Bookmarks', () => {
      const bookDTO: BookMarkDTO = {
      title: "Game of Throne",
      description: "Epic Movie",
      link: "https://ajiozi.con"
    }
      it('Should create a bookmark', () => {
        return pactum
        .spec()
        .post('/api/bookmarks')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(bookDTO)
        .expectStatus(201)
        .stores('bookmarkId', 'id')
      })
     })

    describe('Get Bookmarks', () => { 
        it('It should get bookmark', () => {
          return pactum
          .spec()
          .get('/api/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
        })
     })
    
    describe('Get Bookmark by Id', () => { 
       it('It should get bookmark by id', () => {
          return pactum
          .spec()
          .get('/api/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
        })
     })


    describe('Edit Bookmark by id', () => { 
        const bookDTO: EditBookMarkDTO ={
            title: "Game of Throne",
            description: "Epic Movie",
            link: "http://ajioz.com",
        }
        it('It should Edit bookmark by id', () => {
            return pactum
            .spec()
            .patch('/api/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .withBody(bookDTO)
            .expectStatus(200)
        })
     })

    describe('Delete Bookmark by id', () => { 
       it('It should delete bookmark by id', () => {
            return pactum
            .spec()
            .delete('/api/bookmarks/{id}')
            .withPathParams('id', '$S{bookmarkId}')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(204)
        });

        it('should get empty bookmark', () => {
          return pactum
            .spec()
            .get('/api/bookmarks')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .expectJsonLength(0)
          })
        })
     });

});