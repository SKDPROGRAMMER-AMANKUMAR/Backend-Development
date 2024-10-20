class ApiError extends Error {
    constructor(
        statusCode,
        message="Something went wrong",
        errors = [],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null //Read about it from Node.js docs
        this.message = message
        this.success = false
        this.errors = errors

        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}