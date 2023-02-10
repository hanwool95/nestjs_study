import {Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, Session, UseInterceptors, UseGuards } from '@nestjs/common';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { CurrentUserInterceptor } from "./interceptors/current-user.interceptor";
import {User} from "./user.entity";
import { AuthGuard } from "../guards/auth.guard";

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
    constructor(private userService: UsersService,
                private authService: AuthService
    ) {}

    // @Get('/whoami')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId);
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(body.email, body.password)
        session.userId = user.id
        return user;
    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password)
        session.userId = user.id
        return user;
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running');
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
