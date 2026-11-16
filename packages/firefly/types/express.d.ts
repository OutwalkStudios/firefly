declare module "@outwalk/firefly/express" {
    import type { Platform, Route } from "@outwalk/firefly";
    import type { Request } from "express";

    export interface ExpressOptions { logErrors?: boolean; }

    export class ExpressPlatform extends Platform {

        constructor(options?: ExpressOptions);

        protected loadController(route: string, middleware: Function[], routes: Route[]): void;
        protected loadErrorHandler(): void;
        protected listen(port: number): void;

        use(...args: any[]): void;
        set(...args: any[]): void;
    }

    export interface RawBodyRequest extends Request { rawBody?: string; }
}