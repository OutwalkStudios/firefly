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