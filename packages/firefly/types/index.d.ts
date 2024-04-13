declare module "@outwalk/firefly" {
    import type { Application as ExpressApplication } from "express";

    export interface Database { connect: () => Promise<void>, use: (plugin: any) => void }
    export interface ApplicationOptions { routes?: string, database?: Database, port?: number; }

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

    export class HttpError extends Error { statusCode: number; constructor(statusCode: number, message?: string); }
    export class BadRequest extends HttpError { constructor(message?: string) }
    export class Unauthorized extends HttpError { constructor(message?: string) }
    export class PaymentRequired extends HttpError { constructor(message?: string) }
    export class Forbidden extends HttpError { constructor(message?: string) }
    export class NotFound extends HttpError { constructor(message?: string) }
    export class MethodNotAllowed extends HttpError { constructor(message?: string) }
    export class NotAcceptable extends HttpError { constructor(message?: string) }
    export class ProxyAuthenticationRequired extends HttpError { constructor(message?: string) }
    export class RequestTimeout extends HttpError { constructor(message?: string) }
    export class Conflict extends HttpError { constructor(message?: string) }
    export class Gone extends HttpError { constructor(message?: string) }
    export class LengthRequired extends HttpError { constructor(message?: string) }
    export class PreconditionFailed extends HttpError { constructor(message?: string) }
    export class ContentTooLarge extends HttpError { constructor(message?: string) }
    export class URITooLong extends HttpError { constructor(message?: string) }
    export class UnsupportedMediaType extends HttpError { constructor(message?: string) }
    export class RangeNotSatisfiable extends HttpError { constructor(message?: string) }
    export class ExpectationFailed extends HttpError { constructor(message?: string) }
    export class ImATeapot extends HttpError { constructor(message?: string) }
    export class MisdirectedRequest extends HttpError { constructor(message?: string) }
    export class UnprocessableContent extends HttpError { constructor(message?: string) }
    export class Locked extends HttpError { constructor(message?: string) }
    export class FailedDependency extends HttpError { constructor(message?: string) }
    export class TooEarly extends HttpError { constructor(message?: string) }
    export class UpgradeRequired extends HttpError { constructor(message?: string) }
    export class PreconditionRequired extends HttpError { constructor(message?: string) }
    export class TooManyRequests extends HttpError { constructor(message?: string) }
    export class RequestHeaderFieldsTooLarge extends HttpError { constructor(message?: string) }
    export class UnavailableForLegalReasons extends HttpError { constructor(message?: string) }
    export class InternalServerError extends HttpError { constructor(message?: string) }
    export class NotImplemented extends HttpError { constructor(message?: string) }
    export class BadGateway extends HttpError { constructor(message?: string) }
    export class ServiceUnavailable extends HttpError { constructor(message?: string) }
    export class GatewayTimeout extends HttpError { constructor(message?: string) }
    export class HttpVersionNotSupported extends HttpError { constructor(message?: string) }
    export class VariantAlsoNegotiates extends HttpError { constructor(message?: string) }
    export class InsufficientStorage extends HttpError { constructor(message?: string) }
    export class LoopDetected extends HttpError { constructor(message?: string) }
    export class NotExtended extends HttpError { constructor(message?: string) }
    export class NetworkAuthenticationRequired extends HttpError { constructor(message?: string) }
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