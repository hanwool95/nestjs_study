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