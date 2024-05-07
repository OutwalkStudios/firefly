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

        protected abstract connect(): Promise<void>;
    }

    export class Application {

        private platform: Platform;
        private database: Database;

        constructor(options: Options);

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

    export class ExpressPlatform extends Platform {

        protected loadController(route: string, middleware: Function[], routes: Route[]): void;
        protected loadErrorHandler(): void;
        protected listen(port: number): void;

        use(...middleware: any[]): void;
    }
}

declare module "@outwalk/firefly/mongoose" {
    import type { SchemaOptions, Schema, ConnectOptions } from "mongoose";
    import type { Decorator, Database } from "@outwalk/firefly";

    export function Entity(options?: SchemaOptions): Decorator;
    export function Index(...index: any[]): Decorator;
    export function Plugin(plugin: any): Decorator;
    export function Prop(type: Object | Schema): Decorator;

    export class MongooseDriver extends Database {

        constructor(options?: { url?: string; } & ConnectOptions);

        protected connect(): Promise<void>;

        plugin(plugin: any): void;
    }
}