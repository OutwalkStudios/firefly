import { BadRequest } from "../errors";

/* this is an abstract class for creating platforms for the Application interface */
export class Platform {

    /* apply the properties to make platforms injectable */
    static _injectable = true;

    /* validate a schema, used for the validation decorator's platform integration */
    async validate(schema, value) {
        const result = await schema["~standard"].validate(value);
        if (result.issues) throw new BadRequest("Validation Failed", { issues: result.issues });
        
        return result.value;
    }

    loadController() {
        throw new Error("loadController(route, middleware, validation, routes) is unimplemented.");
    }

    loadErrorHandler() {
        throw new Error("loadErrorHandler() is unimplemented.");
    }

    listen() {
        throw new Error("listen(port) is unimplemented.");
    }
}