/* error object for throwing errors with http status codes */
export class HttpError extends Error {

    constructor(statusCode, message, metadata = {}) {
        super(message);
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
}

/* error object for throwing a Bad Request http error */
export class BadRequest extends HttpError {
    constructor(message = "Bad Request", metadata = {}) { super(400, message, metadata); }
}

/* error object for throwing an Unauthorized http error */
export class Unauthorized extends HttpError {
    constructor(message = "Unauthorized", metadata = {}) { super(401, message, metadata); }
}

/* error object for throwing a Payment Required http error */
export class PaymentRequired extends HttpError {
    constructor(message = "Payment Required", metadata = {}) { super(402, message, metadata); }
}

/* error object for throwing a Forbidden http error */
export class Forbidden extends HttpError {
    constructor(message = "Forbidden", metadata = {}) { super(403, message, metadata); }
}

/* error object for throwing a Not Found http error */
export class NotFound extends HttpError {
    constructor(message = "Not Found", metadata = {}) { super(404, message, metadata); }
}

/* error object for throwing a Method Not Allowed http error */
export class MethodNotAllowed extends HttpError {
    constructor(message = "Method Not Allowed", metadata = {}) { super(405, message, metadata); }
}

/* error object for throwing a Not Acceptable http error */
export class NotAcceptable extends HttpError {
    constructor(message = "Not Acceptable", metadata = {}) { super(406, message, metadata); }
}

/* error object for throwing a Proxy Authentication Required http error */
export class ProxyAuthenticationRequired extends HttpError {
    constructor(message = "Proxy Authentication Required", metadata = {}) { super(407, message, metadata); }
}

/* error object for throwing a Request Timeout http error */
export class RequestTimeout extends HttpError {
    constructor(message = "Request Timeout", metadata = {}) { super(408, message, metadata); }
}

/* error object for throwing a Conflict http error */
export class Conflict extends HttpError {
    constructor(message = "Conflict", metadata = {}) { super(409, message, metadata); }
}

/* error object for throwing a Gone http error */
export class Gone extends HttpError {
    constructor(message = "Gone", metadata = {}) { super(410, message, metadata); }
}

/* error object for throwing a Length Required http error */
export class LengthRequired extends HttpError {
    constructor(message = "Length Required", metadata = {}) { super(411, message, metadata); }
}

/* error object for throwing a Precondition Failed http error */
export class PreconditionFailed extends HttpError {
    constructor(message = "Precondition Failed", metadata = {}) { super(412, message, metadata); }
}

/* error object for throwing a Content Too Large http error */
export class ContentTooLarge extends HttpError {
    constructor(message = "Content Too Large", metadata = {}) { super(413, message, metadata); }
}

/* error object for throwing a URI Too Long http error */
export class URITooLong extends HttpError {
    constructor(message = "URI Too Long", metadata = {}) { super(414, message, metadata); }
}

/* error object for throwing an Unsupported Media Type http error */
export class UnsuppportedMediaType extends HttpError {
    constructor(message = "Unsuppported Media Type", metadata = {}) { super(415, message, metadata); }
}

/* error object for throwing a Range Not Satisfiable http error */
export class RangeNotSatisfiable extends HttpError {
    constructor(message = "Range Not Satisfiable", metadata = {}) { super(416, message, metadata); }
}

/* error object for throwing an Expectation Failed http error */
export class ExpectationFailed extends HttpError {
    constructor(message = "Expectation Failed", metadata = {}) { super(417, message, metadata); }
}

/* error object for throwing an I'm A Teapot http error */
export class ImATeapot extends HttpError {
    constructor(message = "I'm A Teapot", metadata = {}) { super(418, message, metadata); }
}

/* error object for throwing a Misdirected Request http error */
export class MisdirectedRequest extends HttpError {
    constructor(message = "Misdirected Request", metadata = {}) { super(421, message, metadata); }
}

/* error object for throwing an UnprocessableContent http error */
export class UnprocessableContent extends HttpError {
    constructor(message = "Unprocessable Content", metadata = {}) { super(422, message, metadata); }
}

/* error object for throwing a Locked http error */
export class Locked extends HttpError {
    constructor(message = "Locked", metadata = {}) { super(423, message, metadata); }
}

/* error object for throwing a Failed Dependency http error */
export class FailedDependency extends HttpError {
    constructor(message = "Failed Dependency", metadata = {}) { super(424, message, metadata); }
}

/* error object for throwing a Too Early http error */
export class TooEarly extends HttpError {
    constructor(message = "Too Early", metadata = {}) { super(425, message, metadata); }
}

/* error object for throwing an Upgrade Required http error */
export class UpgradeRequired extends HttpError {
    constructor(message = "Upgrade Required", metadata = {}) { super(426, message, metadata); }
}

/* error object for throwing a Precondition Required http error */
export class PreconditionRequired extends HttpError {
    constructor(message = "Precondition Required", metadata = {}) { super(428, message, metadata); }
}

/* error object for throwing a Too Many Requests http error */
export class TooManyRequests extends HttpError {
    constructor(message = "Too Many Requests", metadata = {}) { super(429, message, metadata); }
}

/* error object for throwing a Request Header Fields Too Large http error */
export class RequestHeaderFieldsTooLarge extends HttpError {
    constructor(message = "Request Header Fields Too Large", metadata = {}) { super(431, message, metadata); }
}

/* error object for throwing an Unavailable For Legal Reasons http error */
export class UnavailableForLegalReasons extends HttpError {
    constructor(message = "Unavailable For Legal Reasons", metadata = {}) { super(451, message, metadata); }
}

/* error object for throwing an Internal Server Error http error */
export class InternalServerError extends HttpError {
    constructor(message = "Internal Server Error", metadata = {}) { super(500, message, metadata); }
}

/* error object for throwing a Not Implemented http error */
export class NotImplemented extends HttpError {
    constructor(message = "Not Implemented", metadata = {}) { super(501, message, metadata); }
}

/* error object for throwing a Bad Gateway http error */
export class BadGateway extends HttpError {
    constructor(message = "Bad Gateway", metadata = {}) { super(502, message, metadata); }
}

/* error object for throwing a Service Unavailable http error */
export class ServiceUnavailable extends HttpError {
    constructor(message = "Service Unavailable", metadata = {}) { super(503, message, metadata); }
}

/* error object for throwing a Gateway Timeout http error */
export class GatewayTimeout extends HttpError {
    constructor(message = "Gateway Timeout", metadata = {}) { super(504, message, metadata); }
}

/* error object for throwing an Http Version Not Supported http error */
export class HttpVersionNotSupported extends HttpError {
    constructor(message = "Http Version Not Supported", metadata = {}) { super(505, message, metadata); }
}

/* error object for throwing a Variant Also Negotiates http error */
export class VariantAlsoNegotiates extends HttpError {
    constructor(message = "Variant Also Negotiates", metadata = {}) { super(506, message, metadata); }
}

/* error object for throwing an Insufficient Storage http error */
export class InsufficientStorage extends HttpError {
    constructor(message = "Insufficient Storage", metadata = {}) { super(507, message, metadata); }
}

/* error object for throwing a Loop Detected http error */
export class LoopDetected extends HttpError {
    constructor(message = "Loop Detected", metadata = {}) { super(508, message, metadata); }
}

/* error object for throwing a Not Extended http error */
export class NotExtended extends HttpError {
    constructor(message = "Not Extended", metadata = {}) { super(510, message, metadata); }
}

/* error object for throwing a Network Authentication Required http error */
export class NetworkAuthenticationRequired extends HttpError {
    constructor(message = "Network Authentication Required", metadata = {}) { super(511, message, metadata); }
}
