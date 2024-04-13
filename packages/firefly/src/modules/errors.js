/* error object for throwing errors with http status codes */
export class HttpError extends Error {

    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

/* error object for throwing a Bad Request http error */
export class BadRequest extends HttpError {
    constructor(message = "Bad Request") { super(400, message); }
}

/* error object for throwing an Unauthorized http error */
export class Unauthorized extends HttpError {
    constructor(message = "Unauthorized") { super(401, message); }
}

/* error object for throwing a Payment Required http error */
export class PaymentRequired extends HttpError {
    constructor(message = "Payment Required") { super(402, message); }
}

/* error object for throwing a Forbidden http error */
export class Forbidden extends HttpError {
    constructor(message = "Forbidden") { super(403, message); }
}

/* error object for throwing a Not Found http error */
export class NotFound extends HttpError {
    constructor(message = "Not Found") { super(404, message); }
}

/* error object for throwing a Method Not Allowed http error */
export class MethodNotAllowed extends HttpError {
    constructor(message = "Method Not Allowed") { super(405, message); }
}

/* error object for throwing a Not Acceptable http error */
export class NotAcceptable extends HttpError {
    constructor(message = "Not Acceptable") { super(406, message); }
}

/* error object for throwing a Proxy Authentication Required http error */
export class ProxyAuthenticationRequired extends HttpError {
    constructor(message = "Proxy Authentication Required") { super(407, message); }
}

/* error object for throwing a Request Timeout http error */
export class RequestTimeout extends HttpError {
    constructor(message = "Request Timeout") { super(408, message); }
}

/* error object for throwing a Conflict http error */
export class Conflict extends HttpError {
    constructor(message = "Conflict") { super(409, message); }
}

/* error object for throwing a Gone http error */
export class Gone extends HttpError {
    constructor(message = "Gone") { super(410, message); }
}

/* error object for throwing a Length Required http error */
export class LengthRequired extends HttpError {
    constructor(message = "Length Required") { super(411, message); }
}

/* error object for throwing a Precondition Failed http error */
export class PreconditionFailed extends HttpError {
    constructor(message = "Precondition Failed") { super(412, message); }
}

/* error object for throwing a Content Too Large http error */
export class ContentTooLarge extends HttpError {
    constructor(message = "Content Too Large") { super(413, message); }
}

/* error object for throwing a URI Too Long http error */
export class URITooLong extends HttpError {
    constructor(message = "URI Too Long") { super(414, message); }
}

/* error object for throwing an Unsupported Media Type http error */
export class UnsuppportedMediaType extends HttpError {
    constructor(message = "Unsuppported Media Type") { super(415, message); }
}

/* error object for throwing a Range Not Satisfiable http error */
export class RangeNotSatisfiable extends HttpError {
    constructor(message = "Range Not Satisfiable") { super(416, message); }
}

/* error object for throwing an Expectation Failed http error */
export class ExpectationFailed extends HttpError {
    constructor(message = "Expectation Failed") { super(417, message); }
}

/* error object for throwing an I'm A Teapot http error */
export class ImATeapot extends HttpError {
    constructor(message = "I'm A Teapot") { super(418, message); }
}

/* error object for throwing a Misdirected Request http error */
export class MisdirectedRequest extends HttpError {
    constructor(message = "Misdirected Request") { super(421, message); }
}

/* error object for throwing an UnprocessableContent http error */
export class UnprocessableContent extends HttpError {
    constructor(message = "Unprocessable Content") { super(422, message); }
}

/* error object for throwing a Locked http error */
export class Locked extends HttpError {
    constructor(message = "Locked") { super(423, message); }
}

/* error object for throwing a Failed Dependency http error */
export class FailedDependency extends HttpError {
    constructor(message = "Failed Dependency") { super(424, message); }
}

/* error object for throwing a Too Early http error */
export class TooEarly extends HttpError {
    constructor(message = "Too Early") { super(425, message); }
}

/* error object for throwing an Upgrade Required http error */
export class UpgradeRequired extends HttpError {
    constructor(message = "Upgrade Required") { super(426, message); }
}

/* error object for throwing a Precondition Required http error */
export class PreconditionRequired extends HttpError {
    constructor(message = "Precondition Required") { super(428, message); }
}

/* error object for throwing a Too Many Requests http error */
export class TooManyRequests extends HttpError {
    constructor(message = "Too Many Requests") { super(429, message); }
}

/* error object for throwing a Request Header Fields Too Large http error */
export class RequestHeaderFieldsTooLarge extends HttpError {
    constructor(message = "Request Header Fields Too Large") { super(431, message); }
}

/* error object for throwing an Unavailable For Legal Reasons http error */
export class UnavailableForLegalReasons extends HttpError {
    constructor(message = "Unavailable For Legal Reasons") { super(451, message); }
}

/* error object for throwing an Internal Server Error http error */
export class InternalServerError extends HttpError {
    constructor(message = "Internal Server Error") { super(500, message); }
}

/* error object for throwing a Not Implemented http error */
export class NotImplemented extends HttpError {
    constructor(message = "Not Implemented") { super(501, message); }
}

/* error object for throwing a Bad Gateway http error */
export class BadGateway extends HttpError {
    constructor(message = "Bad Gateway") { super(502, message); }
}

/* error object for throwing a Service Unavailable http error */
export class ServiceUnavailable extends HttpError {
    constructor(message = "Service Unavailable") { super(503, message); }
}

/* error object for throwing a Gateway Timeout http error */
export class GatewayTimeout extends HttpError {
    constructor(message = "Gateway Timeout") { super(504, message); }
}

/* error object for throwing an Http Version Not Supported http error */
export class HttpVersionNotSupported extends HttpError {
    constructor(message = "Http Version Not Supported") { super(505, message); }
}

/* error object for throwing a Variant Also Negotiates http error */
export class VariantAlsoNegotiates extends HttpError {
    constructor(message = "Variant Also Negotiates") { super(506, message); }
}

/* error object for throwing an Insufficient Storage http error */
export class InsufficientStorage extends HttpError {
    constructor(message = "Insufficient Storage") { super(507, message); }
}

/* error object for throwing a Loop Detected http error */
export class LoopDetected extends HttpError {
    constructor(message = "Loop Detected") { super(508, message); }
}

/* error object for throwing a Not Extended http error */
export class NotExtended extends HttpError {
    constructor(message = "Not Extended") { super(510, message); }
}

/* error object for throwing a Network Authentication Required http error */
export class NetworkAuthenticationRequired extends HttpError {
    constructor(message = "Network Authentication Required") { super(511, message); }
}
