/* this is an abstract class for creating platforms for the Application interface */
export class Platform {
    
    loadController() { 
        throw new Error("loadController(route, routes) is unimplemented.");
    }

    loadErrorHandler() {
        throw new Error("loadErrorHandler() is unimplemented.");
    }

    listen() {
        throw new Error("listen(port) is unimplemented.");
    }
}