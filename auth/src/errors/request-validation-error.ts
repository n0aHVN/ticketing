import { ValidationError } from "express-validator";

//Kế thừa của Error để tạo thành Custom error của chúng ta.
export class RequestValidationError extends Error {
    statusCode = 400;
    constructor(public errors: ValidationError[]) {
        super();
        //Do chúng ta extends a built in class nên sẽ có dòng code này
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            switch (err.type) {
                case 'field':
                    return { message: err.msg, path: err.path};
                default:
                    return { message: err.msg, path: 'unknow'};
            }
            
        });
    }

}