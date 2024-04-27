import { Controller, Inject, Get } from "@outwalk/firefly";

@Controller()
export class HelloController {

    @Inject() helloService;

    @Get()
    getWelcomeMessage() {
        return this.helloService.getWelcomeMessage();
    }
}