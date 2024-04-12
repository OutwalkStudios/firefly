declare module "@outwalk/firefly" {
    import type { Application as ExpressApp, Request, Response, NextFunction } from "express";

    interface DatabaseDriver { connect: () => Promise<void> }
    interface ApplicationOptions { database?: DatabaseDriver, port?: number; }

    type Middleware = (req: Request, res: Response, next: NextFunction) => void;

    export class Application {

        app: ExpressApp;
        port: number;

        constructor(options?: ApplicationOptions);

        use(middleware: Middleware): void;

        listen(callback: () => void): Promise<void>
    }

    export function Controller(route?: string): void;
    export function Get(route?: string): void;
    export function Injectable(): void;
    export function Inject(): void;
}

declare module "@outwalk/firefly/errors" {

    export class NotFound extends Error { statusCode: number; }
    export class BadRequest extends Error { statusCode: number; }
}

declare module "@outwalk/firefly/mongoose" {
    import type { SchemaOptions, SchemaType, ConnectOptions } from "mongoose";

    export function Entity(options?: SchemaOptions): void;
    export function Prop(type: SchemaType): void;

    interface MongooseOptions extends ConnectOptions {
        url?: string;
    }

    export class MongooseDriver {

        constructor(options?: MongooseOptions);

        connect(): Promise<void>;
    }
}