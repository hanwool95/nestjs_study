### Section3(CLI 기초 설명)

Pipe → Guard → Controller → Service → Repository 기본 모듈 구조를 두고 비즈니스 로직에서 어떤 부분이 필요할지 생각.

충격. 강의자는 개인적으로 eslint를 안 쓴다고 주석 처리를 한다…..(맞나…?)

nest cli는 이 모든 것 생성 도와줌.

nest generate module [모듈이름]

nest generate controller [모듈이름]/[컨트롤러이름] —flat(컨트롤러 디렉 생성 방지용. 컨트롤러 복잡하면 빼야할듯.)

여기서 추천하는 API Clinets로 [postman.com](http://postman.com) (근데 그냥 Swagger 쓰는 것이 좋아 보인다.)

### Section4(Pipe & Validating)

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

### Section5(Service & Repository)

| Service | Repository |
| --- | --- |
| 클래스임 | 클래스임 |
| 비즈니스 로직 | 저장 관련 로직 |
| 1개 이상 레포지토리를 이용
→ 데이터 사용 | ORM or Schema |

service가 Repository를 이용해서 데이터 사용하고, service의 인스턴스를 Controller에  넘겨주는 로직. 따라서, Controller → Service → Repository 의존성이 생김.

하지만 의존성 설정에서 주의할 점이 있음!

그냥 의존할 대상을 복사해서 설정하는 것은 좋지 않고,

constructor의 argument로 받아서 의존성 설정을 해주는 것이 좋고,

직접 지정하지 않고 interface로 상태를 지정해둔 것이 최고. (어떤 것을 의존하던, interface의 조건만 맞으면 사용 가능한 상태. 추상화 전략으로 최고인듯.)

nest DI Container로 의존성 관리.

- Injectable 데코레이터 사용 + Module에서 Provider 등록
### Section6(Organizing Code with Modules)

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