## Section3(CLI 기초 설명)

Pipe → Guard → Controller → Service → Repository 기본 모듈 구조를 두고 비즈니스 로직에서 어떤 부분이 필요할지 생각.

충격. 강의자는 개인적으로 eslint를 안 쓴다고 주석 처리를 한다…..(맞나…?)

nest cli는 이 모든 것 생성 도와줌.

nest generate module [모듈이름]

nest generate controller [모듈이름]/[컨트롤러이름] —flat(컨트롤러 디렉 생성 방지용. 컨트롤러 복잡하면 빼야할듯.)

여기서 추천하는 API Clinets로 [postman.com](http://postman.com) (근데 그냥 Swagger 쓰는 것이 좋아 보인다.)

## Section4(Pipe & Validating)

nest는 decorator를 이용해서 Request의 정보들을 꺼낼 수 있다.

```jsx
@Param('id')
@Query()
@Headers()
@Body()
```

nest의 ValidationPipe로 query 유효성 검사 쉽게 할 수 있음.

Dto(Data Transfer Object)를 가지는 request body를 class로 정의하여, 타입 지정해주는 것만으로 유효성 검사 가능!

class-validator: 데코레이터로 유효성 검사 가능하게 만드는 라이브러리.

## Section5(Service & Repository)

| Service         | Repository    |
|-----------------|---------------|
| 클래스임            | 클래스임          |
| 비즈니스 로직         | 저장 관련 로직      |
| 1개 이상 레포지토리를 이용 |               |
| → 데이터 사용        | ORM or Schema |

service가 Repository를 이용해서 데이터 사용하고, service의 인스턴스를 Controller에  넘겨주는 로직. 따라서, Controller → Service → Repository 의존성이 생김.

하지만 의존성 설정에서 주의할 점이 있음!

그냥 의존할 대상을 복사해서 설정하는 것은 좋지 않고,

constructor의 argument로 받아서 의존성 설정을 해주는 것이 좋고,

직접 지정하지 않고 interface로 상태를 지정해둔 것이 최고. (어떤 것을 의존하던, interface의 조건만 맞으면 사용 가능한 상태. 추상화 전략으로 최고인듯.)

nest DI Container로 의존성 관리.

- Injectable 데코레이터 사용 + Module에서 Provider 등록

## Section6(Organizing Code with Modules)

모듈 간의 의존 관계를 이해하기 위해 컴퓨터 시스템으로 비유하여 설계하는 실습

컴퓨터 모듈

- 컴퓨터 컨트롤러
    - run()

CPU 모듈 (← 컴퓨터 모듈)

- CPU 서비스
    - compute()

Disk 모듈 (← 컴퓨터 모듈)

- Disk Service
    - getData()

Power 모듈 (← CPU 모듈, Disk 모듈)

- Power Service
    - supplyPower()

기존 모듈 안에서 의존성 설정할 때는

1. Injectable 데코레이터를 추가하고
2. 모듈 안에서 provider로 등록한 다음
3. constructor에 집어 넣었다.

하지만 모듈간의 의존성을 설정할 때는

1. export할 서비스를 해당 모듈의 exports로 등록하고 (**등록하지 않으면 priavte 즉, 다른 모듈 간의 주입이 불가능함**.)
2. import 할 서비스가 있는 모듈에서 export하는 모듈을 import한 다음
3. constructor에 집어 넣는다.


## Section7(Project Design)

차 판매 API High level Design하는 실습.

1. Method, Route, Body(or Query String), Description 정리.
2. 정리한 것을 기반으로 필요한 Module를 구분(Resource 중심으로 하는 듯)한 뒤,
3. 이에 따라 필요한 Controllers, Services, Repository 파악 및 생성(CLI generate).


## Section8(Type ORM)

TypeORM: SQLite(강의자는 이걸 시퀄라이트라고 발음한다…. ㄷㄷ. 선 넘네.) , Postgres, MySQL, MongoDB 다룰 수 있는 nest ORM 라이브러리

Repository를 만들 필요 없이, 엔티티 만들어서 연결.

AppModule에 imports하는 것으로 자동으로 연결된 모듈과 연결.

TypeORM의 엔티티 만드는 방식

1. 엔티티 파일 제작하고 class 안에 properties 목록 추가.
- Entity, Column, PrimaryGenerateColumn 데코레이터 import하여 제작.
2. 엔티티를 부모 모듈과 연결(이걸로 레포지토리가 생성됨)
3. 엔티티를 Root(app module)와 연결
- forRoot의 entities 안에 등록하는 것으로 연결.

보통 ORM은 Migration을 작성하여 데이터베이스 구조를 변경.

그런데 TypeORM은 synchronize 옵션을 true로 주는 것으로 데코레이터 기준으로 추가된 구조 확인하고 그냥 변경해줌 ㄷㄷ.(그런데 반대로 지우는 것도 그냥 묻지도 않고 데이터 깨끗이 지워버리니, production에서는 synchronize 사용하지 말라고 함)

Type ORM doc

[https://typeorm.io/repository-api](https://typeorm.io/repository-api)

대표: create, save, find, findOne, remove

Dto에 적용한 prop 이외의 정보가 body에 있으면 알아서 걸러준다고 한다.


## Section9(Service & Controller 제작)

```tsx
@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }
}
```

type orm 의존성 주입을 위해 Section5에서 배운 방식사용.

constructor 파라미터 안에 typeorm의 InjectRepository 데코레이터를 사용(제네릭을 위한 것이라고 함.)

현재까지 플로우 총 정리

Request → ValidationPipe(Dto로 Request Body form 유효성 검증) → Controller(routes와 필요 데이터 선택) → Service(정의된 Entity 기반으로 로직 수행) → Repository(ORM에 의해 제작되어 DB 제어) → DB

create과 save 동작 차이.

- create는 db에 어떤 영향도 하지 않고 Entity 기반의 instance만 제작
- save는 intance 기반 DB 반영
- 물론, save에 데이터 때려만 박아도 동작한다!
  그러면 왜 굳이 나누어서 진행하는가?
  - create로 인스턴스를 만드는 과정에서 Dto 기반 유효성 검증이 이루어지기 때문이라고 함.
  - 인스턴스를 생성하지 않고 save로 넘어가면 훅(AfterInsert)이 동작하지 않는다고 함.

insert, update, delete도 마찬가지라 함.

```tsx
update(id: number, newEmail: string, newPassword: string) {}
```

update를 작성할 때, one by one으로 파라미터에 정의해주는 것은 좋지 않다고 함.

- 일부 요소만 수정할 수도 있음
- 수정 가능한 요소들이 많아질 수록 파라미터가 길어짐.

```tsx
update(id: number, attrs: Partial<User>) {}
```

- Partial를 이용하면 User 여러 조합을 모두 valid한 것으로 간주함.

update logic: findOne → Object.assign → save

에러 핸들링에 관하여

- Service에서 404를 던지면 HTTP 기반 컨트롤러는 받아내지만, WebSocket이나 GRPC는 처리 방법이 없어 받지 못한다고 한다.

```tsx
//update-user.dto.ts
import { IsEmail, IsString, IsOptional } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    password: string;
}
```

IsOptional 데코레이터를 사용하여 Optional한 Dto를 정의할 수 있음.

```tsx
// user.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) {
    }

    create(email:string, password: string) {
        const user = this.repo.create({ email, password })

        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }

    find(email: string) {
        return this.repo.find( {where: { email } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('user not found')
        }
        Object.assign(user, attrs)
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return this.repo.remove(user);
    }

}
```

```tsx
//users.controller.ts

import {Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException} from '@nestjs/common';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";

@Controller('auth')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.userService.create(body.email, body.password);
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found')
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string){
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto ) {
        return this.userService.update(parseInt(id), body);
    }
}
```


## Section10(Custom Data Serialization)

Class Serializer Interceptor

- Interceptor? Request 들어오는 것 처리, 혹은 내보내기 전 처리 해주는 것.
- Service로부터 가져온 Entity Instance를 정해진 규칙(Dto에서 데코레이터로 설정 가능)에 따라 object 제작.
- Controller에서 Decorator를 사용하여 Intercepting 가능, 각 route에도 설정 가능, global하게 설정도 가능.
- `UseInterceptors`, `ClassSerializerInterceptor`
- DTO로 Serializer Rule 정하기 가능.

```tsx
// interceptors/serialize.interceptor.ts

import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class SerializeInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // Run something before a request is handled by the request handler
        console.log('Im running before the handler', context);

        return next.handle().pipe(
            map((data: any)=> {
                // Run something before the response is sent out
                console.log('Im running before response is sent out', data)
            })
        )
    }
}
```

implements: extend와 다르고 interface처럼 쓰여서, 타입 확인하게 만들어줌(intercept 등 필요 method 있는지 확인 등).

intercept method의 파라미터

- context: reqpuest 정보
- next: controller의 request handler, 즉 route handler 그 자체.

next.handle() 이전에, 데코레이터로 감싼 handler가 실행하기 전에 context 가지고 처리를 할 수 있음. pipe 함수를 사용하여, handler 실행 이후의 data 처리 가능.

```tsx
// interceptors/serialize.interceptor.ts

import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

// any class
interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map((data: ClassConstructor)=> {
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true,
                });
            }),
        );
    }
}
```

```tsx
// users.controller.ts

.....

import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private userService: UsersService) {}
.....
}
```

UseInterceptors를 데코레이터로 직접 컨트롤러에 생성해서 원하는 dto 넣을 수 있지만, 그렇게 하지 않고, 자체적으로 Serialize 데코레이터를 제작할 수 있음.

Interceptor에서 constructor로 data를 받아서 추상화 가능.

## Section11(Authentication From Scratch)

### Hash

회원가입 로직: POST로 데이터 전송(Client) → 이메일 확인과 비밀번호 복호화, 인증 되면 쿠키 전송(Server) → 브라우저에 쿠키 저장(Client) → 쿠키 인증(Server)

Users Service에 의존하는 Auth Service를 새로 제작.

- 작은 서비스에서는 Users Service 안에 다 구현해도 괜찮지만, 서비스 안에 기능들을 무작정 확장만 시키는 것은 프로젝트 규모가 커질 수록 집중도가 떨어짐.

```tsx
export class AuthService {
    constructor(private userService: UsersService) {}
```

repository가 아닌 의존하는 Service를 constructor에서 가져와서 사용.

잠깐! 비밀번호를 해싱한다는 것이란?

1. 당연하지만 비밀번호를 그대로 db에 저장하는 것은 좋지 않다.
2. Hashing Function은 값을 특정 계산에 의해 전혀 다른 값으로 만드는 것으로, input 값의 일부만 변경되더라도 output은 전혀 다른 결과가 됨.
3. output 값을 가지고 원본 값을 유추하기 위한 backward 계산이 불가능함.
4. 추후 사용자가 비밀번호를 입력하면, 그 비밀번호의 Hashing Function 결과 값을 db에 저장된 값과 비교하여 인증.
5. 단순히 HashingFunction만 사용하는 것은 rainbow table(자주 입력하는 특정 비밀번호들 목록) attack으로 공격 받을 수 있음.
6. 랜덤하게 만들어진 stringdls Salt를 추가하는 것으로 유추를 불가능하게 만들 수 있음.(조금만 바뀌어도 해시가 완전 바뀐다는 특성을 활용)

crypto 라이브러리의 randomBytes로 salt 제작, scrypt로 해싱 가능.

```tsx
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)
```

scrypt는 callback을 사용하는데, 강의자님의 주장으로는 콜백을 다루는 것은 자바스크립트 개발자 모두가 싫어하기에(좀 그렇긴 하지….. ㅋㅋㅋㅋㅋ) promisify를 사용하여 단순화 시킨다 함.

`const hash = await scrypt(password, salt, 32);`

scrypt의 세 번째 파라미터는 string 갯수 결정.

```tsx
//users.controller.ts

.....

@Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.signUp(body.email, body.password)
    }

    @Post('/signin')
    signIn(@Body() body: CreateUserDto) {
        return this.authService.signIn(body.email, body.password)
    }

.....
```

```tsx
//auth.service.ts

import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async signUp(email: string, password: string) {
        // See if email is in use
        const users = await this.userService.find(email);
        if (users.length) {
            throw new BadRequestException('email in use')
        }
        // hash the users password
        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Hash the salt and the password together
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        // Join the hashed result and the salt together
        const result = salt + '.' + hash.toString('hex')

        // Create a new user and save it
        const user = await this.userService.create(email, result);

        // return the user
        return user;
    }

    async signIn(email: string, password: string) {
        const [user] = await this.userService.find(email);
        if (!user) {
            throw new NotFoundException('user not found')
        }

        const [salt, storedHash] = user.password.split('.')

        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')){
            throw new BadRequestException('bad password');
        }

        return user;
    }
}
```

### Coockie and Session

쿠키와 세션?

1. 쿠키는 무작위로 나열된 string value를 가짐
2. 서버는 쿠키를 받아서 디코딩하여 object를 만들어 세션에 저장
3. 클라이언트의 요청에 따라 서버는 세션 object 값을 바꿈
4. 서버는 세션 object를 암호화하고 쿠키를 만들고 클라이언트에게 전송.

`const cookieSession = require('cookie-session');`

- nest와 쿠키 세션 사이의 문제로 require를 써야만 한다는 문제가 있다고 함.

```tsx
app.use(cookieSession({
    keys: ['asfasfdasdf']
}))
```

main.ts의 bootstrap 안에 cookieSession을 넣어서 세션 전역에서 사용 가능. keys의 value는 해싱 기준 값.

```tsx
@Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(body.email, body.password)
        session.userId = user.id
        return user;
    }
```

회원가입이나 로그인 할 때 session에 userId를 기록하여서

```tsx
@Get('/whoami')
    whoAmI(@Session() session: any) {
        return this.userService.findOne(session.userId);
    }
```

로그인정보를 불러올 때 session에 있는 userId 기준으로 불러올 수 있음. 없으면 undefined 처리.

```tsx
@Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }
```

로그아웃은 세션의 userId를 빈값으로

### Interceptor & Decorator

```tsx
// current-user.decorator.ts

import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.session.userId
    }
)
```

현 사용자가 누구인지 알려주는 Interceptor와 Decorator 제작 가능.

createParamDecorator에서의 반환 값은 데코레이터를 감싼 파라미터의 argument가 됨

data는 데코레이터에서 받는 파라미터 값. 로그인 확인 데코레이터는 값을 받지 않으니 never처리.

context의 타입으로 Request를 사용한다면 http만 적용되겠지만, ExecutionContext는 다른 여러 프로토콜에도 대응이 가능하다고 함.

### ⚠️  데코레이터 단독으로는 안되는 이유!

데코레이터 안에서는 Session에 접근하여 사용자 Id 값까지 가져오는 것은 가능. 문제는 UserService의 인스턴스를 가져와서 작업을 진행해야 할 때임.

Service는 Dependency system으로, 현재 UserService는 userRepository를 사용하고, 오직 Dependency injection으로 사용이 가능. Decoratior는 Dependency injection으로 사용할 수 없음. (즉, Decorator가 Service 자원을 이용할 수 없는 것.)

```tsx
// current-user.interceptor.ts

import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {UsersService} from "../users.service";

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler){
        const request = context.switchToHttp().getRequest()
        const { userId } = request.session || {};

        if (userId) {
            request.currentUser = await this.userService.findOne(userId);
        }

        return handler.handle();
    }
}
```

```tsx
// current-user.decorator.ts

import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: never, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.currentUser;
    }
)
```

따라서 interceptor를 만들어서 Session으로부터 current user를 가져오고, UserService의 인스턴스를 받아온 뒤, 그 자원을 데코레이터가 이용하도록 설정해야 함. (인터셉터가 먼저 실행되어 request에 currentUser를 할당하고, 데코레이터가 실행될 때 할당 된 currentUser 활용 가능.)

globally하게 해당 모듈 모든 controller에 inteceptor 할당하는 방법.

**`APP_INTERCEPTOR` **활용**

```tsx
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, {
    provide: APP_INTERCEPTOR,
    useClass: CurrentUserInterceptor}]
})
export class UsersModule {}
```

### Guard

```tsx
// auth.guard.ts

import {
    CanActivate,
    ExecutionContext
} from "@nestjs/common";

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        return request.session.userId;
    }
}
```

```tsx
// users.controller.ts

.....

@Get('/whoami')
@UseGuards(AuthGuard)
whoAmI(@CurrentUser() user: User) {
        return user;
    }

.....
```

인가 되지 않는 사용자를 앞단에서 막음.

UseGuards 데코레이터 안에 값으로 직접 만든 AuthGuard(아스가르드 ㄷㄷ) 넣고, canActivate 안에서 반환하는 값이 undefined 되어 있는지 여부로 판단. (없으면 403)

## Section12(Unit Testing)

- unit testing: 각 method와 class가 잘 작동 되는지 확인
- Integration testing: Feature의 전체 흐름을 테스트 (end to end testing)

nest.js에는 test directory가 있음. `app.e2e-sspec.ts`가 integration test를 위한 것.

unit test는 src안에 있음. 각 `spec` 파일.

```tsx
// auth.service.spec.ts

import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";

it('can create an instance of auth service', async () => {
    const module = await Test.createTestingModule({
        providers: [AuthService]
    }).compile();

    const service = module.get(AuthService)

    expect(service).toBeDefined();
});
```

임시로 Di 컨테이너 제작.

하지만 아직 AuthService에 Dependency를 걸지 않았기에 에러가 걸리는 상황. `npm run test:watch`

```tsx

it('can create an instance of auth service', async () => {
        // Create a fake copy of the users service
    const fakeUsersService = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({ id: 1, email, password })
    }

    const module = await Test.createTestingModule({
        providers: [AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService
            }]
    }).compile();

    const service = module.get(AuthService)

    expect(service).toBeDefined();
});
```

따라서 임시로 Service 객체를 만들어서 테스트 코드 작성.

```tsx
providers: [AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService
            }]
```

providers에 사용할 서비스를 넣는 것으로 넣는 것으로 DI container는 만들어야 하는 객체를 알 수 있음.

{} 안에 넣은 것은 DI를 re-route한 것. UsersService를 원할 때 fakeUserService를 사용하라고 알려주는 것. (so, AuthService를 가져올 때 의존 걸려있는 UserService를 가져오는데, 이 때 fakeUserService를 가져오는 것. UserService에서 실행하는 find()와 create()이 fake find()와 create()으로 실행 됨.)

```tsx
const fakeUsersService = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({ id: 1, email, password })
    }
```

`Promise.resolve` 로 프로미스를 만들고 바로 resolve하여 value를 만듦.(const arr = await fakeUsersServic.find())

```tsx
const fakeUsersService: Partial<UsersService> = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
    }
```

이때  find와 create의 type 지정을 보장하기 위해 typescript를 활용하여 오리지날을 타입 지정.

package.json의 scripts 부분에서

`"test: watch": "jest --watch",`를 `"test:watch": "jest --watch --maxWorkers=1",`로 바꾸면 속도가 빨라진다고 한다.??

```tsx
let service: AuthService;

beforeEach(async () => {
    // Create a fake copy of the users service
    const fakeUsersService: Partial<UsersService> = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
    }

    const module = await Test.createTestingModule({
        providers: [AuthService,
            {
                provide: UsersService,
                useValue: fakeUsersService
            },
        ],
    }).compile();

	service = module.get(AuthService)
})
```

beforeEach 사용하여 이 파일에 실행되는 각 테스트 전에 실행할 것을 정의.

이것으로 fakeUserService와 모듈을 컴파일하여 새로운 서비스를 갖는 것으로 시작 가능.

beforeEach 안에 있는 service는 it 과 다른 스코프에 있기에, let으로 스코프 바깥에서 정의.

```tsx
describe('AuthService',  () => {
    let service: AuthService;

.....

        expect(service).toBeDefined();
    });
});
```

describe로 전체 테스트 과정을 감싸주는 것으로, 테스트 정리를 쉽게 하도록 만들어줌.(어떤 테스트인지 테스트 환경에서 잘 구별하도록 설명해주는 함수.)

```tsx
it('creates a new user with a salted and hashed password', async ()=>{
      const user = await service.signUp('asdf@asdf.com', 'asdf');

      expect(user.password).not.toEqual('asdf');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    })
```

이제 비밀번호가 잘 hash와 salt 되었는지 확인하는 작업 제작.

임의의 이메일과 비밀번호를 준 뒤, 비밀번호가 원본과 같은지 확인 후, 각 salt와 hash가 존재하는지 확인.

```tsx
it('throws an error if user signs up with email that is in use', async ()=> {
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1'} as User])
        await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });
```

이제 이미 등록한 이메일 다시 등록했을 경우, 에러가 잘 발생되는지 테스트.

fakeUsersService의 find를 재정의 해서 무조건 결과값이 나오도록 만듦. 따라서, signUp 과정에서 find 했을 때 BadRequestException이 나오도록 설정을 했기에, 에러가 잘 발생하면 테스트 통과되도록 `rejects.toThrow()`로 설정.

```tsx
it('throws if signin is called with an unused email', async () => {
        await expect(
            service.signIn('asdflkj@asdflfkj.com', 'passdflkj'),
        ).rejects.toThrow(NotFoundException)
    })
```

로그인시 존재하지 않은 이메일 사용했을 때 404가 잘 뜨는지 테스트.

service의 find()는 현재 빈 배열을 반환하도록 설정했기에, 아무 이메일이나 적어서 회원가입 시도. `rejects.toThrow()`안에 NotFoundException 넣어서 설정.

```tsx
it('throws if an invalid password is provided', async () => {
        fakeUsersService.find = () => Promise.resolve([
            { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
        ]);
        await expect(
            service.signIn('laskdjf@alskdfj.com', 'password'),
        ).rejects.toThrow(BadRequestException)
    })
```

비밀번호 일치하지 않을 때 BadRequestException 뜨는지 테스트. service의 find 함수를 다시 정의해서, 임의의 이메일과 비밀번호를 가져오도록 만들고, 비밀번호를 일치하지 않게 했을 때 BadRequestException 나오는지 확인.

```tsx
const users: User[] = [];
fakeUsersService = {
    find: (email: string) => {
        const filteredUsers =users.filter(user => user.email === email)
        return Promise.resolve(filteredUsers);
    },
    create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 99999), email, password } as User
        users.push(user);
        return Promise.resolve(user);
    }

....

it('returns a user if correct password is provicded', async () => {
        await service.signUp('asdf@asdf.com', 'mypassword')
        const user = await service.signIn('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined()
    })
```

비밀번호 일치 여부를 확인하기 위해서는 실제 salt hash된 비밀번호를 제공해야 함.

2가지 방법.

첫 번째는 간단하게, 실제로 회원가입하고 salt hash된 결과를 집어 넣어서 테스트 하는 방법. 하지만 당연히 좋지 않은 방법.

두 번째는 실제 회원가입 해서 메모리에 저장하고, 회원가입을 하는 방법. 이것을 위해서는 FakeUserService가 실제로 메모리 상에서 동작하도록 변경해야 함.

```tsx
it('throws an error if user signs up with email that is in use', async ()=> {
        await service.signUp('asdf@asdf.com', 'asdf')
        await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });

.....

it('throws if an invalid password is provided', async () => {
    await service.signUp('laskdjf@alskdfj.com', 'password');
    await expect(
        service.signIn('laskdjf@alskdfj.com', 'laksdlfkj'),
    ).rejects.toThrow(BadRequestException)
})
```

service가 메모리 상에서 동작하게 되었기에, find로 임의의 데이터를 정의하지 않고, 직접 실제 서비스 플로우 대로 구현하여 테스트 가능

Controller test는?

```tsx
fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdf@asdf.com', password: 'asdfjkl;'} as User)
      },
      find: (email: string) => {
        return Promise.resolve([ { id: 1, email, password: 'asdfjkl;'} as User])
      }
  };
fakeAuthService = {
			signIn: (email: string, password: string) => {
	        return Promise.resolve({ id: 1, email, password} as User)
	      }
}
```

```tsx
const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();
```

controller test도 마찬가지로 종속된 fake 서비스를 만들고 useValue로 redirect.

```tsx
it('findAllUser returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com')
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com')
  })

it('findUser returns a single user with the given id', async () => {
  const user = await controller.findUser('1');
  expect(user).toBeDefined();
})

it('findUser throws an error if user with given id is not found',
    async () => {
  fakeUserService.findOne = () => null;
  await expect(controller.findUser('1')).rejects.toThrow(NotFoundException)
    })

it('signin updates session object and returns user', async () => {
  const session = { userId: -10 };
  const user = await controller.signIn({ email: 'asdf2asdf.com', password: 'asdf'},
      session)

  expect(user.id).toEqual(1);
  expect(session.userId).toEqual(1)
})
```

기능 하나씩 코드 작성.

근데 이렇게 보니 확실히 테스트 코드가 기능 명세서 같다는 것이 느껴진다.

## Section13(Integration Testing)

Integration Testing?

- end to end test!
- nest에서는 test/app.e2e-spec.ts 에 정의되어 있음.
- single method 보다는, entire instance가 잘 작동되는지를 확인하는 것!
- command: npm run `test:e2e`

실습은 `auth.e2e-spec.ts` 파일을 만들어 Sign up, Sign in 테스트!

```tsx
it('handles a signup request', () => {
        const email = 'asdfkj232q@afdfdfd.com'
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email, password: 'asdf'})
            .expect(201)
            .then((res) => {
                const { id, email: resEmail } = res.body;
                expect(id).toBeDefined()
                expect(resEmail).toEqual(email)
            })
    });
```

chain으로 상황 설정과 기대값 설정.

method로 path 적고, send로 body 값 설정 가능.

기대하는 response code 설정 가능.

then으로 response 값 검증 가능.

하지만 그냥 이렇게 하면 failed 뜸 왜?

cannot set property ‘userId’ of undefined

test 중에는 main.ts 파일이 실행되지 않아 cookie-session 과 validation Pipe 생성이 skip 됨.

user Session Object에 userId를 할당하려고 했기에 에러가 뜬 것.

그럼 해결책?

1. 쉬운 방법(정말 별로인 방법이라고 강조함): main.ts에 실행되는 쿠키와 pipe 부분을 그대로 복제한 export 함수 제작. testing file에 적용.
2. nest한 방법

app 모듈이 pipe과 session를 세팅하게 함.

```tsx
// app.module.ts
@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'db.sqlite',
    entities: [User, Report],
    synchronize: true,
  }),
    UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})
```

app 모듈에서 providers로 validationPipe 만들어 사용하도록 설정.

```tsx
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(
        cookieSession({
          keys: ['asfasfdasdf'],
        })).forRoutes('*');
  }
}
```

쿠키 세션 미들웨어를 글로벌 미들웨어로 변경.

forRoutes(*)로 모든 request 적용하게 만들어 global middleWare로 만듦.

하지만 이래도 에러 뜸 왜?

이메일이 실제로 테스트 과정에서 만들어지고, 또 똑같이 만들면 400 에러 뜨기 때문.

테스트할 때 마다 새로운 App instance와 빈 DB를 만들어 독립적으로 사용하는 방법이 있음. 하지만 그러면 sign in 할 때 기존 아이디가 없어 테스트 할 수 없음.

따라서 Development Mode db와 Testing Mode db 분리.

```tsx
//app.module.ts

imports: [TypeOrmModule.forRoot({
    type: 'sqlite',
    database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
    entities: [User, Report],
    synchronize: true,
  }),
```

typeOrmModule에서 database 지정하는 string을 환경에 따라 다르게 지정하는 방법이 있음.

## Section14(Managing App Configuration)

`@nestjs/config` 이용에 관하여.

dotenv는 기본적으로 js에서 제공해주는 라이브러리로, configuration 관리 가능.

하지만, nest의 docs와 다르게 하나 이상의 .env 파일을 제작하지 못함. → production과 local 차이나는 config 설정 어려움.

```tsx
@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: `.env.${process.env.NODE_ENV}`
      }),
			TypeOrmModule.forRootAsync({
			        inject: [ConfigService],
			        useFactory: (config: ConfigService) => {
			          return {
			            type: 'sqlite',
			            database: config.get<string>('DB_NAME'),
			            synchronize: true,
			            entities: [User, Report],
			          }
			        }
			      }),
```

ConfigModule를 `@nestjs/config`에서 import하여 환경에 따라 다른 env path 설정.

TypeOrmModule에 ConfigService 주입하여, config에 따라 DB_NAME을 가져오도록 설정.

이제 저 NODE_ENV를 undefined되지 않도록 지정해주어야 함.

runtime environment를 지정하기 위하여, `cross-env` 라이브러리 설치.

```tsx
"scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "cross-env NODE_ENV=development nest start",
    "start:dev": "cross-env NODE_ENV=development nest start --watch",
    "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "cross-env NODE_ENV=test jest",
    "test:watch": "cross-env NODE_ENV=test jest --watch",
    "test:cov": "cross-env NODE_ENV=test jest --coverage",
    "test:debug": "cross-env NODE_ENV=test node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json"
  },
```

package.json에서 cross-env로 NODE_ENV 지정.

하지만 이대로 test 돌리면 database is locked 에러가 뜸. db instance를 2개 이상 만들었기 때문.

따라서 이를 해결하기 위해서는 jest에게 테스트를 병렬처리하지 말라고 하면 됨.

```tsx
"test:e2e": "cross-env NODE_ENV=test jest --config ./test/jest-e2e.json --maxWorkers=1"
```

package.json script에서 해당 옵션에 —maxWorkers를 1로 주면 됨.

이제 테스트 전에 db를 wipe하고 db를 recreate 자동화하는 작업이 가능함.(즉 초기화!)

테스트마다 한 번 실행되는 global beforeEach 지정.

```tsx
//jest-e2e.json

{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "setupFilesAfterEnv": ["<rootDir>/setup.ts"]
}
```

그것을 위해서 `jest-e2e.json`에 `setupFilesAfterEnv` 설정 추가하여 파일이 실행되도록 함.

```tsx
//setup.ts

import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
    await rm(join(__dirname, '..', 'test.sqlite'));
});
```

그리고 setup.ts에 global beforeEach 실행.

라이브러리를 활용해서 test.sqlite 파일을 초기화하도록 설정.

```tsx
it('signup as a new user then get the currently logged in user', async () => {
        const email = 'asdf@asdf.com';

        const res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({email, password: 'asdf'})
            .expect(201)

        const cookie = res.get('Set-Cookie');

        const { body } = await request(app.getHttpServer())
            .get('/auth/whoami')
            .set('Cookie', cookie)
            .expect(200)
        
        expect(body.email).toEqual(email)
    })
```

나머지 테스트 부분 제작.

response를 바탕으로 쿠키 가져오고, 쿠키 설정도 테스트 가능.


## Section15(Relations with TypeORM)

reports 기능 제작하는 시간.

```tsx
// src/reports/dtos/create-report.dto.ts

import {
    IsString,
    IsNumber,
    Min,
    Max,
    IsLongitude,
    IsLatitude,
} from "class-validator";

export class CreateReportDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    @Max(2100)
    year: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @IsLongitude()
    lng: number;

    @IsLatitude()
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;
}
```

먼저 Craeate에 대한 Dto 정의.

number 범위 지정 위해 min max import

```tsx
// src/reports/reports.controller.ts

import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {CreateReportDto} from "./dtos/create-report.dto";
import { ReportsService } from "./reports.service";
import { AuthGuard } from "../guards/auth.guard";

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body: CreateReportDto) {
        return this.reportsService.create(body);
    }
}
```

그다음 Controller

Injectable한 Service constructor로 정의.

only user Authenticated를 주기 위해, useGuard로 Auth.guard 설정.

```tsx
// /src/reports/reports.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report } from "./report.entity";
import {CreateReportDto} from "./dtos/create-report.dto";

@Injectable()
export class ReportsService {
    constructor(
       @InjectRepository(Report) private repo: Repository<Report>
    ) {}

    create(reportDto: CreateReportDto) {
        const report = this.repo.create(reportDto);

        return this.repo.save(report);
    }
}
```

이제 필요한 service 제작.

repository 설정이 필요.

이제 관계형이 필요!!

reports한 사용자가 누구인지, user_id라는 관계형 column 필요

관계형 종류

- one to one. (수도 & 국가)
- one to many & many to one (소비자 & 주문)
- many to many (수업들 & 학생들)

typeorm 라이브러리로 데코레이터 이용해서 관계형 설정 가능.

```tsx
//src/users/user.entity.ts

...

@OneToMany(()=> Report, (report) => report.user)
    reports: Report[];

...
```

```tsx
// src/reports/report.entity.ts

...

@ManyToOne(() => User, (user) => user.reports)
    user: User;

...
```

User는 OneToMany, 그리고 reports는 ManyToOne

데코레이터로 첫 argument로 상대 Entity를 불러와서 지정.(dependency)

그 다음 두 번째 arguemnt에서 어떤 column인 관계가 있는지 설정. (relation이 어떻게 setup 되는지! 어떻게 그 instance에서 column까지 이동을 할지!)

```tsx
// reports/reports.controller.ts

...

@Post()
    @UseGuards(AuthGuard)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);
    }

...
```

```tsx
// reports/reports.service.ts

...

create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;

        return this.repo.save(report);
    }

...
```

초반에 만들었던 current user decorator를 이용하여, Controller에서 user entity를 가져옴.

service에서 user entity를 report에 등록.

그런데, response에서 원치 않은 password까지 보내주게 됨..

그럼 무슨 방법이 있을까?

- user entity에 있는 모든 정보가 들어감.
- 따라서 그냥 userId만 response에 넣도록 하는 것도 방법.

따라서 response를 formatting!

```tsx
// reports/dtos/report.dto.ts

import { Expose, Transform } from "class-transformer";

export class ReportDto {
    @Expose()
    id: number;
    @Expose()
    price: number;
    @Expose()
    year: number;
    @Expose()
    lng: number;
    @Expose()
    lat: number;
    @Expose()
    make: string;
    @Expose()
    model: string;
    @Expose()
    mileage: number;

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number;
}
```

```tsx
// reports/reports.controller.ts

....

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user);

....
```

Dto 활용하여 response formatting.

userId 경우 Transform을 이용해서 user id 가져옴.

controller에서 Serialize 데코레이터를 감싸주고 formatting해줄 Dto 지정.


## Section16(Basic Permissions System)

```tsx
// report.entity.ts

@Entity()
export class Report {

...

    @Column({ default: false })
    approved: boolean;

...
```

승인 시스템 만들기 위해 entity에 report이라는 boolean column 추가.

```tsx
// dtos/approve-report.dto.ts

import { IsBoolean } from "class-validator";

export class ApproveReportDto {
    @IsBoolean()
    approved: boolean;
}
```

validation 체크를 위한 dto 제작.

```tsx
// reports.controller.ts

@Controller('reports')
export class ReportsController {
...

	@Patch('/:id')
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        return this.reportsService.changeApproval(id, body.approved)
    }
}
```

Controller에 approved를 수정할 수 있도록 Patch 데코레이터로 감싸진 approveReport 제작.

```tsx
// reports.service.ts

@Injectable()
export class ReportsService {

...

async changeApproval(id: string, approved: boolean) {
        const report = await this.repo.findOne({ where: { id: parseInt(id)}});
        if (!report) {
            throw new NotFoundException('report not found');
        }
        
        report.approved = approved;
        return this.repo.save(report);
    }
}

```

id 기준으로 찾고, approved 대로 바꿔주는 서비스 제작.

이제 이 로직을 application 운영자만 할 수 있도록 Authorization 제작.

여기서 Authentication과 Authorization 차이!

- Authentication: 누가 이 request를 만들었는지 확인하는 것(Interceptor로 current user 쿠키 확인하는 것 같은)
- Authorization: request 만든 사람이 접근 허용 되었는지 확인하는 것 (auth.guard 같은 것)

reports 수정으로 Request 오면, `AdminGuard`이 `request.currentUser`가 `administrator`인지 확인하고, routeHandler로 보내도록 제작할 것.

```tsx
// user.entity.ts

@Entity()
export class User {

...

    @Column( { default: false })
    admin: boolean;

...
```

Admin Guard 만들기 위해 userEntity에 먼저 admin column 제작해야 함.

```tsx
// guards/admin.guard.ts

import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        if (!request.currentUser) {
            return false
        }
        return request.currentUser.admin;
    }
}
```

guards 디렉 안에 admin.guard.ts 제작.

request의 currentUser.admin을 return 하는 guard.

```tsx
		@Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto){
        return this.reportsService.changeApproval(id, body.approved)
    }
```

만들어 놓은 서비스에 데코레이터 지정.

이렇게 하면 될 것 같지만, 기대한 것과 달리 403 에러 발생.

왜?

nest의 근본적인 구조 때문.

- 기본 플로우
  - Request → 미들웨어 → Guards → Request Handler(전 후에 Interceptor) → Response
- 제작한 구조 기반 플로우
  - Request → 쿠키 세션 미들웨어 → AdminGuard → Request Handler (CurrentUserInterceptor) → Response

CurrentUserInterceptor가 실행되기 전에 AdminGuard가 실행되기 때문. currentUser가 세팅이 안된 것. currentUser가 무조건 undefined가 되기에 403이 나온 것.

따라서 CurrentUserInterceptor를 (Global) 미들웨어로 바꿔서 AdminGuard 실행 전에 currentUser를 받아올 수 있도록 해야 함.

```tsx
// users/middlewares/current-user.middleware.ts

import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {UsersService} from "../users.service";

import { User } from "../user.entity";

declare global {
    namespace Express {
        interface Request {
            currentUser?: User;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(
        private userService: UsersService
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {};

        if (userId) {
            req.currentUser = await this.userService.findOne(userId);
        }
        next();
    }
}
```

NestMiddleware 기반으로 미들웨어 제작.

Injection을 이용해서 UserService 사용.

declare global로 Express의 Request에 currentUser가 있다는 타입 지정.

```tsx
// user/user.module.ts

.....

export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
```

users.module에서 글로벌 middleware 지정.

nest는 query param으로 받는 것을  모두 string으로 받아들임

so, validation 지정이 필요할 때 따로 처리 필요.

```tsx
// dtos/get-estimate.dto.ts

import {
    IsString,
    IsNumber,
    Min,
    Max,
    IsLongitude,
    IsLatitude,
} from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1930)
    @Max(2100)
    year: number;

    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    lng: number;

    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    lat: number;
}
```

`class-transformer`의 `Transform` 데코레이터 사용!


### Section 18(Production Deployment)

이제 배포!!

```tsx
export class AppModule {
    constructor(
        private configService: ConfigService
    ) {
    }
  configure(consumer: MiddlewareConsumer){
    consumer.apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
        )
        .forRoutes('*');
  }
}
```

쿠키 key issue

글로벌 미들웨어로 세션을 임의로 string 만들었어.

production에서는 환경변수로 넣어야 함.

so, static하게 하드코딩으로 넣었던 키를 env 불러와서 적용.

이 프로젝트의 프로덕션 환경에서는 Postgres 사용할 것.

SQLite로 돌렸던 개발과 테스트환경과 다르게, 프로덕션을 위한 세팅이 필요.

Synchronize Flag true dhqtus의 문제점.

entity = database!?

실수로 요소를 지우면, db의 열을 지워서 모든 데이터를 잃어버릴 수 있어.

따라서 deploy할 때는 `synchronize: false` 절대적으로 해라!

그럼 db 구조 어떻게 변경해? 그래서 `migration`을 이용하는 것!!

Migration File에서 up()으로 구조를 만들고, down()은 up으로 만든 모든 것을 지우도록.

그럼 typeORM에서 migration 만드는 방법?

- nest와 typeORM은 정말 쿵짝 맞지만, migration으로 가면 정말 별로다라고 강의자는 주장.

개발환경 migration 만드는 방법

- 서버 중단
- TypeORM CLI로 migration file 생성
- migration 파일에서 코드 변경
- TypeORM CLI로 migration db에 적용
- DB 업데이트, 그리고 서버 재실행

그런데,, nest에서 TypeORM? TypeORM CLI는 오직 엔티티와 migration file만 실행함. nest가 무엇인지, config module이 뭔지 모름! 어떻게 module이 db 연결하는지 모르는 난감한 상태임.

다시 말하자면 그래서 왜 이게 그렇게 어려워?

일단 CLI에게 어떻게 db 연결하고 migration하는지 알려줘야 해.

원래는 app module이 연결했지만 module를 TypeORM CLI가 보지를 않아!

연결하는 여러 방법을 typeorm.io/#/using-ormconfig에서 알려줌.

하지만 이 각 방법이 생각만큼 잘 동작하지 않음.

- ormconfig.json: script가 없어서 static하기에 환경 구분할 수 없음
- ormconfig.xml: script가 없어서 static하기에 환경 구분할 수 없음
- 환경변수: Deploy할 때 문제가 됨. typeORM이 특정 변수를 사용하도록 함.
- ormconfig.js
- ormconfig.ts

그럼 js와 ts 파일만 가능?

ts 파일은 기대했던 것처럼 되지는 않음.

```tsx
// ormconfig.ts

export = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['**/*.entity.ts'],
    synchronize: false
}
```

하지만 에러가 나옴.

TypeORM은 ormconfig 파일을 접근해서 connection setting하는데, 서버 실행 과정에서 export에 대해서 unexpect가 나옴.

그럼 왜 에러가 ts에서 나오는 것? nest 실핼 할 때마다 모든 ts src 파일을 js로 번역해서 dist 폴더 안 main에 밀어 넣음. ts가 js가 되는 시점에 ormconfig.ts는 자바스크립트가 되어 execution이 fail 되는 것. ts 파일을 만들었음에도.

그래서 ormconfig.ts는 사용할 수 없어.

```tsx
// ormconfig.js

module.exports = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: ['**/*.entity.ts'],
    synchronize: false
}
```

그러면 ormconfig.js는 좋아?

이것도 이슈 있어.

js로 변환 되었기에, *.entity.ts import를 하지 못함.

그럼 entity도 js로 바꾸면? 서버가 실행 되기는 함!!

그럼 문제 없어??

아니야….. Multiple environment에서 운영이기에 다른 부분도 봐야해!

그래서 test를 돌리면 fail이 뜸. js를 가져온다는 에러…

execution 환경과 test 환경은 또 다르기에. test 환경은 ts-jest를 실행. typescript를 direct하게! 따라서, ormconfig.ts 파일은 test가 또 가능하긴 할 것.

그래서 ts-jest에게 js 파일 있어도 괜찮다는 세팅을 해야 함.

그럼 tsconfig.json에 allow js true를 한다면?

일단 test 돌려도 에러 뜸… ㅎ… 무슨 문제?

Entity를 불러오지 않음. test가 운영될 때는 오직 ts를 가져오는데, entity들이 js로 되어 있기에 문제.

```tsx
// ormconfig.js

module.exports = {
    type: 'sqlite',
    database: 'db.sqlite',
    entities: process.env.NODE_ENV === 'development'
        ? ['**/*.entity.js']
        : ['**/*.entity.ts'],
    synchronize: false
};
```

그래서 env에 따라 다르게 설정해야 함!

이런식으로 nest와 typeORM은 config 세팅이 서로 맞물려서 복잡하다 함.

ormconfig.js 파일에 typeORM모듈 정의 파트 분리하여 환경별로 나누도록 제작.

```tsx
// ormconfig.js

var dbConfig = {
    synchronize: false
};

switch (process.env.NODE_ENV) {
    case 'development':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: ['**/*.entity.js'],
            synchronize: false
        })
        break;
    case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            synchronize: false
        })
        break;
    case 'production':
        break;
    default:
        throw new Error('unknown environment')
}
```

switch 문을 이용해서 NODE_ENV에 따라 다른 config 적용.

default는 우리가 예상하지 못한 env가 온 것이기에, 에러 처리.

synchronize는 확실히 false로 설정. 지우고 서버 실행하면, synchronize false로 생각한 대로 처리가 안 될 것.

따라서 migration이 필요해! migration 위해서는 TypeORM cli 활용.

typeorm.io/#/using-cli

entity를 설정하는 방법으로 js, ts 두 가지 방법.

우리는 ts 방법으로 할 것. 하지만 typeORM은 ts랑 호환이 잘 되지는 않음.

1. `npm install -g ts-node` 설치하고.
2. package.json에 script영역에 typeorm 커맨드 정의
   `"typeorm": "cross-env NODE_ENV=development node --require ts-node/register ./node_modules/typeorm/cli.js"`
3. `npm run typeorm migration:run`으로 migration 실행 가능.

typeorm.io/#/migrations

1. ormconfig.js에 설정 추가

```tsx
// ormconfig.js

var dbConfig = {
    synchronize: false,
    migrations: ['migrations/*.js'],
    cli: {
        migrationsDir: 'migrations',
    }
};
```

1. `npm run typeorm migration:generate -- initial-schema -o`
   -n으로 이름. -o로 js파일 형성.
   근데 이 부분부터 typeORM 0.3.0 이상 기준 강의 내용이 반영되지 않음.

type ORM은 entity 달라진 부분을 확인하여 자동으로 migration 작성.
2. `npm run typeorm migration:run` 으로 migration 반영
   db.sqilte에 필요한 column이 생성됨.

test environment에도 적용되어야 함.

이대로 실행하면 에러 발생. table이 없기 때문!

```tsx
// ormconfig.js

...
case 'test':
        Object.assign(dbConfig, {
            type: 'sqlite',
            database: 'test.sqlite',
            entities: ['**/*.entity.ts'],
            migrationsRun: true
        })
        break;
...
```

test 실행할 때마다 (test) db를 삭제할 것이기에, 매 test 실행마다 migration 실행되도록 해야 함.

이제 실제 배포 프로세스 config 설정!

Heroku에 배포할 것.

헤로쿠에서 Nest App 있는 Git Repo와 Postgres DB 연결.

```tsx
// ormconfig.js

case 'production':
        Object.assign(dbConfig, {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            migrationsRun: true,
            entities: ['**/*.entity.js'],
            ssl: {
                rejectUnauthorized: false
            }
        })
        break;
```

production에서는 postgres 사용.

database에 접근 가능한 user id password 포함된 db url를 환경변수로 정의

migrations이 빌드마다 이루어지도록 정의

entity의 위치 제공.

Procfile로 헤로쿠가 어떻게 app 실행할지 정의해줘.

```tsx
// Procfile

web: npm run start:prod
```

tsconfig.build.json에 빌드시 제외될 부분 지정

```tsx
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "exclude": ["ormconfig.js", "migrations","node_modules", "test", "dist", "**/*spec.ts"]
}
```

`heroku addons:create heroku-postgresql:hobby-dev` db 생성

`heroku config:set COOKIE_KEY=lkdsjfldksfjdl`  환경변수 설정

`heroku config:set NODE_ENV=production` production 환경이라는 것 환경변수로 설정.

## 보너스 타입스크립트 강의

Typescript = Javascript + A type system(이것에 대해 다루고자 함.)

type system 목표

- 개발 과정에서 에러 잡아내는 것!
- 타입 주석처럼 사용하여 코드 분석에 용이함
- 당연히 개발 환경에서만 작동, 브라우저는 타입스크립트 몰라용
- 퍼포먼스 최적화를 제공하지는 않음

typescript compiler 설치.

`npm install -g typescript ts-node`

간단한 network API 제작하여 타입스크립트가 왜 필요한지 보여주는 강의.

`jsonplaceholder.typicode.com`

fake api 사용 가능.

```tsx
import axios from "axios";

const url = 'https://jsonplaceholder.typicode.com/todos/1'

axios.get(url).then(response => {
    console.log(response.data);
});
```

간단히 get 하는 함수 제작.

`ts-node index.ts`

tsc index.ts → node index.js 과정을 하나로 함축하는 명령어.

타입스크립트를 js로 인코딩하고 실행.

```tsx
		const todo = response.data;

    const ID = todo.ID;
    const title = todo.Title;
    const finished = todo.finished;
```

코드를 실행하기 전에는, 데이터를 잘 불러오는지 알 수 없어.

그래서 타입스크립트 쓰는 것.

```tsx
interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

axios.get(url).then(response => {
    const todo = response.data as Todo;

    const ID = todo.ID;
    const title = todo.Title;
    const finished = todo.finished;

});
```

type 지정을 해주면 개발 환경에서 에러를 잡아줌.

```tsx
logTodo(id, completed, title)
});

const logTodo = (id, title, completed) => {
    console.log(`
        The Todo with ID: ${id}
        Has a title of: ${title}
        Is it finished? ${completed}
    `);
};
```

파라미터 잘못들어간 것도 js에서는 실행 전까지는 몰라.

```tsx
logTodo(id, title, completed)
});

const logTodo = (id: number, title: string, completed: boolean) => {
    console.log(`
        The Todo with ID: ${id}
        Has a title of: ${title}
        Is it finished? ${completed}
    `);
};
```

파라미터에 타입 지정해주어 잘못 들어갔을 경우 바로 에러 확인 가능.

Type: 다른 속성과 함수에 대해 그 값이 갖고 있는 것을 알려주는 쉬운 방법.

- Primitive Types: number, boolean, void, undefined, string, symbol, null
- Object Types: functions, arrays, classes, objects
- Type annotations: 코드. 타입스크립트에게 어떤 타입을 사용할지 알려주는 것.
- Type inference: 타입스크립트가 어떤 타입일지 알아내는 것.
    - 변수 선언과 변수 할당이 같은 줄에 있다면 타입스크립트는 타입을 유추함 `let apples = 5;`
    - 그럼 왜 annotations를 작성하고 언제 작성해? 어차피 타입스크립트가 알아낸다며?
        1. 함수가 any 타입을 반환할 때!: 다양한 반환 값 가능성이 있는 함수일 경우.

            ```tsx
            // When to use annotations
            // 1) Function that returns the 'any' type
            const json = '{"x": 10, "y": 20}';
            const coordinates: { x: number; y: number;} = JSON.parse(json);
            console.log(coordinates)
            ```

        2. 변수 선언 이후, 나중에 값을 할당할 때: 변수에 다양한 값 할당 가능성이 있는 경우!

            ```tsx
            // 2) When we declare a variable on one line
            // and init later
            letwords= ['red', 'green', 'blue'];
            letfoundWord: boolean;
            
            for (let i = 0; i <words.length; i++){
                if (words[i] === 'green'){
            foundWord= true
                }
            }
            ```

        3. inferred가 정확히 되지 않을 때. 즉, inferred대로 되지 않는 예외 케이스가 있을 때

            ```tsx
            // 3) Variable whose type cannot be inferred correctly
            letnumbers= [-10, -1, 12];
            letnumberAboveZero: boolean | number = false;
            
            for (let i = 0; i <numbers.length; i++) {
                if (numbers[i] < 0) {
            numberAboveZero=numbers[i];
                }
            }
            ```



```tsx
// annotations
const logNumber: (i: number) => void = (i) => {
    console.log(i);
}

// inference
const logNumber: (i: number) => void = (i: number) => {
    console.log(i);
}
```
### Function의 Type

- Annotations for Functions: Typescript에 어떤 타입의 argument를 받고, 어떤 타입의 값을 반환할지 알려주는 것.
- inference for functions: 오직 반환 값만 알아 냄.

```tsx
const add = (a: number, b: number): number => {
    return a + b;
};

// return 값은 예측해줌!(argument는 역으로 예측 안함)
const add = (a: number, b: number) => {
    return a + b;
};
// 하지만 return type을 정해주면 error를 일으켜 휴먼 에러를 잡아주기에 타입 지정해주면 좋긴 함.
```

### void와 Never

- void: undefined가 반환되는 것.
- never: `throw new Error();` 같은 경우, 어떤 것도 반환되지 않는 것.

```tsx
const logger = (message: string): void => {
    console.log(message);
    return undefined;
}

const throwError = (message: string): never => {
    throw new Error(message);
}
```

### Destructing

```tsx
const logWeather = (forecast: { date: Date, weather: string}): void => {
    console.log(forecast.date)
    console.log(forecast.weather)
}

// ES2015
const logWeatherDestructed = ({ date, weather }: { date: Date, weather: string}) => {
    console.log(date)
    console.log(weather)
}

logWeather(todaysWeather)
```

```tsx
const profile = {
    name: 'alex',
    age: 20,
    coords: {
        lat: 0,
        lng: 15
    },
    setAge(age: number): void {
        this.age = age;
    }
};

const { age }: { age: number } = profile;
const { coords: { lat, lng } }: { coords: { lat: number; lng: number } } = profile;
```

비구조 할당 할 때도 비구조된 양식으로 타입 지정해야 함.

### Array

```tsx
const carMakers = ['ford', 'toyota', 'chevy'];
```

이런식으로 string만 정의하면, type inferrence는 아 `string[]`이라는 것을 유추함.

```tsx
const carMakers: string[] = [];
```

하지만 빈 array라서 inferrence가 안 된다면 지정해줘야 함.

```tsx
const carsByMake: string[][] = [
    ['f150'],
    ['corolla'],
    ['camaro']
];
```

2차원 array도 가능함!

- 값을 추출할 때 어떤 타입인지 유추하게 도와줌!

```tsx
// Help with inference when extracting values
const car = carMakers[0];
const myCar = carMakers.pop();
```

- 잘 못된 값을 넣을 때 에러로 막아줌!

```tsx
// Prevent incompatible values
carMakers.push(100)
```

- map 함수를 도와줄 뿐더러, 그 안쪽에서도 어떤 value를 선택할 수 있는지 도와줌!

```tsx
// Help with 'map'
carMakers.map((car: string): string => {
    return car;
})
```

- 유동적으로 다양한 type을 지정해 관리할 수 있음.

```tsx
// Flexible types
const importantDates: (Date | string)[] = [new Date(), '2030-10-10'];
```

### Tuple

튜플: array같은 구조로 각 요소가 특정 record의 속성을 대표함

drink: {color → brown, carbonated → true, sugar → 40}

⇒ [ brown, true, 40 ]: [ string, boolean, number ]

order에 따라 element 속성을 알게 됨!

```tsx
const drink = {
    color: 'brown',
    carbonated: true,
    sugar: 40
};

const pepsi = ['brown', true, 40];
```

하지만 pepsi 이대로 사용하면 order 깨졌을 때 정보를 잃음.

```tsx
type Drink = [string, boolean, number];

const pepsi: Drink = ['brown', true, 40];
```

그래서 튜플 이렇게 사용. 이 order에 어떤 의미가 있다는 것을 개발자에게 인지해 줌.

근데 튜플은

```tsx
const carSpecs: [number, number] = [400, 3354];
```

이렇게 된다면 각 number가 무슨 의미인지 몰루

```tsx
const carStats = {
    horsepower: 400,
    weight: 3354
};
```

이게 좋지

### Interface

interface? 타입. object의 타입 값을 묘사해줌.

```tsx
const oldCivic = {
    name: 'civic',
    year: 2000,
    broken: true
};

const printVehicle = (vehicle: { name: string; year: number; broken: boolean }): void => {
    console.log(`Name: ${vehicle.name}`)
    console.log(`Year: ${vehicle.year}`)
    console.log(`broken: ${vehicle.broken}`)
};

printVehicle(oldCivic)
```

이렇게 쓰면 파라미터 타입 지정할 때 너무 길고, 사용할 때마다 반복해서 사용해야 함.

```tsx
interface Vehicle {
    name: string;
    year: number;
    broken: boolean;
}

...

const printVehicle = (vehicle: Vehicle): void => {
    console.log(`Name: ${vehicle.name}`)
    console.log(`Year: ${vehicle.year}`)
    console.log(`broken: ${vehicle.broken}`)
};

...
```

그래서 인터페이스 사용!!

```tsx
interface Vehicle {
    name: string;
    year: Date;
    broken: boolean;
    summary(): string;
}

const oldCivic = {
    name: 'civic',
    year: new Date(),
    broken: true,
    summary(): string {
        return `Name: ${this.name}`;
    }
};
```

또, 다양한 type 사용 가능

함수도 지정 가능!

```tsx
interface Reportable {
    summary(): string;
}

const oldCivic = {
    name: 'civic',
    year: new Date(),
    broken: true,
    summary(): string {
        return `Name: ${this.name}`;
    }
};

const printSummary = (item: Reportable): void => {
    console.log(item.summary());
};

printSummary(oldCivic)
```

interface. 데이터에 거꾸로 더 많은 props가 있어도 상관이 없음.

```tsx
const drink = {
  color: 'brown',
  carbonated: true,
  sugar: 40,
    summary(): string {
      return `My drink has ${this.sugar} grams of sugar`;
    }
};

const printSummary = (item: Reportable): void => {
    console.log(item.summary());
};

printSummary(oldCivic)
```

완전 다른 drink object로도 Reportable로 사용 가능!

다른 shape object랑 사용이 가능하다는 것!

그래서 function에 더 일반적인 로직을 짤 수 있도록 도와줌.

generic interface가 지정되면 되기 때문!

따라서 interfaces의 타입 지정을 받는 함수를 만들어 코드를 만드는 것이 ts의 재사용 전략!

### Classes

classes: object의 blueprint. field(values)와 method(functions)로 구성

ts에서의 클래스는 es15 js와 약간 다름.

```tsx
class Vehicle {
    drive(): void {
        console.log('chugga chugga');
    }

    honk(): void {
        console.log('beep');
    }
}

class Car extends Vehicle {
    drive(): void {
    console.log('vroom');}
}
const car = new Car();
car.drive();
car.honk();
```

extends로 확장.

overridden도 존재.

```tsx
class Vehicle {
    protected honk(): void {
        console.log('beep');
    }
}

class Car extends Vehicle {
    private drive(): void {
    console.log('vroom');
    }

    startDrivingProcess(): void {
        this.drive();
        this.honk();
    }
}

const car = new Car();
car.startDrivingProcess();
```

일단 modifier

- public: 아무 명시도 하지 않으면 자동으로. 언제 어디서 call 가능한 method.
- private: 같은 class 안에서만
- protected: 같은 class와 자녀 class 까지만

override할 때는 child는 부모 것을 수정할 수 없음(같아야 함)

```tsx
class Vehicle {

    constructor(public color: string = 'red') {
    }

    protected honk(): void {
        console.log('beep');
    }
}
```

constructor로 field를 정의 가능.

public을 이용하여 따로 정의할 필요 없이 인자로 filed 정의 가능.

그럼 extend할 때는?

일단 자녀는 constructor할 필요는 없어.

부모것을 자동으로 constructing 함. 만약 자녀에서 constructor를 추가할거면, super();를 추가해야 함.

```tsx
class Car extends Vehicle {
    constructor(public wheels: number, color: string) {
        super(color);
    }
 ...
}
```

그럼 classes 왜 이용해?

interfaces 이유랑 비슷해. ts에서 재사용성을 높이기 위해서!!

### Parcel로 앱 만들기!

`npm install -g parcel-bundler`

서버 띄우는 법 `npx parcel index.html`

index.html를 읽어서 자동으로 서버 띄움!

각 class가 하나의 분리된 파일 안에서 정리되는 구조로 제작할 것.

- Map.ts, User.ts, Company.ts

faker 라이브러리로 랜덤 데이터 자동 생성.

*참고!! js 라이브러리의 경우 ts에 바로 못 쓰고 `@types/...` 등으로 누군가 만들어 놓은 type 지정 라이브러리를 설치해야 동작할 경우가 있음.

typescript에서 object는 init이 필요해

type 지정해놓고 바로 안에 있는 instance 값 지정하면, undefined에서 지정할 수 없다고 뜸.

```tsx
import { faker } from "@faker-js/faker";
class User {
    name: string;
    location: {
        lat: number;
        lng: number;
    };

    constructor() {
        this.name = faker.name.firstName();
        this.location = {
            lat: parseFloat(faker.address.latitude()),
            lng: parseFloat(faker.address.longitude())
        }
    }
}
```

따라서 object를 제작을 해야 함.

faker 라이브러리를 이용해서 랜덤 가짜 값 채워넣을 수 있음.

export 하면 {} 안에 값아서 해당 값을 다른 곳에서 import 할 수 있음.

default로 export 하면 감싸지 않고, 자신이 원하는 이름으로 지정할 수 있음. 하지만 컨벤션상 ts에서는 default 안 쓴다고 함.

**typecript 라이브러리는, type 지정한 것을 읽는 것만으로 라이브러리 활용 방법에 대한 힌트를 얻을 수 있다!**

```tsx
export class CustomMap {
    private googleMap: google.maps.Map;

    constructor(divId: string) {
        this.googleMap = new google.maps.Map(document.getElementById(divId) as HTMLElement, {
            zoom: 1,
            center: {
                lat: 0,
                lng: 0
            }
        })
    }
}
```

다른 개발자가 특정 라이브러리 작동 원리를 일일히 알 필요 없도록, 추상화할 수 있음. 안쓰이는 라이브러리를 가리고 커스텀 class 제작.

private으로 구글맵에 대해 접근하지 못하도록 설정.