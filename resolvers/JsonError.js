module.exports = class JsonError extends Error {
    constructor(obj) {
        super(obj)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, JsonError)
        }
        this.message = obj
    }
}
