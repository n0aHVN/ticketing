import { CustomError } from "./custom-errors";

export class NotAuthroizedError extends CustomError{
    statusCode = 401;
    constructor(){
        super('Not Authorized');
        Object.setPrototypeOf(this, NotAuthroizedError.prototype);
    }
    serializeErrors(){
        return [{message: 'Not Authorized'}];
    }
}