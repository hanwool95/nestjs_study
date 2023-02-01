import { Controller, Get } from '@nestjs/common'

@Controller()
class AppController {
    @Get()
    getRootRoute() {
        return 'hi there!';
    }
}