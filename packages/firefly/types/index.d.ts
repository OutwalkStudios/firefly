declare module "@outwalk/firefly" {
    export interface Route { method: string, middleware: Function[], route: string, handler: Function }
    export interface Options { platform: Platform, database?: Database }

    export type Decorator = (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;

    export abstract class Platform {

        protected abstract loadController(route: string, middleware: Function[], routes: Route[]): void;
        protected abstract loadErrorHandler(): void;
        protected abstract listen(port: number): void;
    }

    export abstract class Database {

        initialize(): void;

        abstract connect(): Promise<Database>;
        abstract isConnected(): boolean;
    }

    export class Application {

        private platform: Platform;
        private database: Database;

        constructor(options: Options);

        static resolveInjectable<T extends new (...args: any[]) => any>(injectable: T): InstanceType<T>;

        listen(port?: number): Promise<void>;
    }

    export function Init(): Decorator;

    export function Controller(route?: string): Decorator;
    export function Http(method: string, route?: string): Decorator;
    export function Head(route?: string): Decorator;
    export function Get(route?: string): Decorator;
    export function Post(route?: string): Decorator;
    export function Put(route?: string): Decorator;
    export function Patch(route?: string): Decorator;
    export function Delete(route?: string): Decorator;

    export function Middleware(...middleware: Function[]): Decorator;

    export function Injectable(): Decorator;
    export function Inject(injectable?: string | { new(): any }): Decorator;
}

declare module "@outwalk/firefly/events" {
    import type { Decorator } from "@outwalk/firefly";

    export class EventEmitter {

        private events: Record<string, Function[]>;

        emit(event: string, payload?: any): void;
        on(event: string, callback: Function): void;
    }

    export function EventListener(): Decorator;
    export function Event(event: string): Decorator;
}

declare module "@outwalk/firefly/eslint" {
    const firefly: {
        readonly configs: {
            readonly language: Readonly<Record<string, any>>;
            readonly recommended: Readonly<Record<string, any>>;
        };
    };

    export default firefly;
}

declare module "@outwalk/firefly/errors" {

    export class HttpError extends Error { statusCode: number; constructor(statusCode: number, message?: string, metadata?: Record<string, any>); }
    export class BadRequest extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class Unauthorized extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class PaymentRequired extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class Forbidden extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class NotFound extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class MethodNotAllowed extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class NotAcceptable extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class ProxyAuthenticationRequired extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class RequestTimeout extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class Conflict extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class Gone extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class LengthRequired extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class PreconditionFailed extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class ContentTooLarge extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class URITooLong extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class UnsupportedMediaType extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class RangeNotSatisfiable extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class ExpectationFailed extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class ImATeapot extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class MisdirectedRequest extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class UnprocessableContent extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class Locked extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class FailedDependency extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class TooEarly extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class UpgradeRequired extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class PreconditionRequired extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class TooManyRequests extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class RequestHeaderFieldsTooLarge extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class UnavailableForLegalReasons extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class InternalServerError extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class NotImplemented extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class BadGateway extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class ServiceUnavailable extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class GatewayTimeout extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class HttpVersionNotSupported extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class VariantAlsoNegotiates extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class InsufficientStorage extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class LoopDetected extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class NotExtended extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
    export class NetworkAuthenticationRequired extends HttpError { constructor(message?: string, metadata?: Record<string, any>) }
}

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

    export interface RawBodyRequest extends Request {
        rawBody?: string;
    }
}

declare module "@outwalk/firefly/mongoose" {
    import type { Decorator, Database } from "@outwalk/firefly";
    import type mongoose from "mongoose";

    // @ts-ignore - using Partial like this is invalid but it satisifies the compiler for our use case.
    export class Schema extends Partial<mongoose.Schema> { }
    export class Model extends mongoose.Model { }

    export function Entity(options?: mongoose.SchemaOptions): Decorator;
    export function Index(...index: any[]): Decorator;
    export function Plugin(plugin: any): Decorator;
    export function Prop(type: Object | mongoose.Schema): Decorator;
    export function Virtual(virtual: mongoose.VirtualTypeOptions): Decorator;

    export class MongooseDatabase extends Database {

        constructor(options?: { url?: string; } & mongoose.ConnectOptions);

        plugin(plugin: any): void;
        connect(): Promise<MongooseDatabase>;
        isConnected(): boolean;

        static get connection(): mongoose.Connection;
    }
}