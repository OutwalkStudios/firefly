import { Injectable } from "@outwalk/firefly";

@Injectable()
export class HelloService {

    getWelcomeMessage() {
        return { message: "Welcome!" };
    }
}