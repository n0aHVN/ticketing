import { ValidationError } from 'express-validator';
import { CustomError } from './custom-errors';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    //Do thư viện express-validator sẽ cho ra nhiều lỗi khác nhau nên phải
      //sử dụng map
    return this.errors.map((err) => {
        switch (err.type) {
            case "field":
                return { message: err.msg, field: err.path}
            default:
                return { message: err.msg, field: "unknown" };
        }
    });
  }
}