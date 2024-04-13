declare module "@outwalk/firefly" {
    import type { Application as ExpressApplication } from "express";

    interface Database { connect: () => Promise<void>, use: (plugin: any) => void }
    interface ApplicationOptions { routes?: string, database?: Database, port?: number; }

    export class Application {

        app: ExpressApplication;

        private routes: string;
        private database: Database;
        private port: number;

        constructor(options?: ApplicationOptions);

        use(middleware: any): void;
        listen(): Promise<void>
    }

    export function Controller(route?: string): void;
    export function Http(method: string, route?: string): void;
    export function Head(route?: string): void;
    export function Get(route?: string): void;
    export function Post(route?: string): void;
    export function Put(route?: string): void;
    export function Patch(route?: string): void;
    export function Delete(route?: string): void;

    export function Injectable(): void;
    export function Inject(name?: string | { new(): any }): void;
}

declare module "@outwalk/firefly/errors" {

    export class NotFound extends Error { statusCode: number = 404; }
    export class BadRequest extends Error { statusCode: number = 500; }
}

declare module "@outwalk/firefly/mongoose" {
    import type { SchemaOptions, SchemaType, ConnectOptions } from "mongoose";

    export function Entity(options?: { plugins?: []; } & SchemaOptions): void;
    export function Prop(type: SchemaType): void;

    export class MongooseDriver {

        constructor(options?: { url?: string; } & ConnectOptions);
        connect(): Promise<void>;
        use(plugin: any): void;
    }
}