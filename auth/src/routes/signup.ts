import express, {Request, Response} from 'express';
import {body,validationResult} from 'express-validator';//Sử dụng thư viện express-validator và sử dụng hàm validationResult để kiểm tra xem có lỗi của email hoặc password hay không
import jwt from 'jsonwebtoken';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email') 
            .isEmail().withMessage('Email must be valid'),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Password must be between 4 and 20 characters')
    ],
    async (req:Request,res:Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            throw new RequestValidationError(errors.array());
        }
        const {email,password} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser){
            throw new BadRequestError('Email in use');
        }
        const user = User.build({email,password});
        await user.save();
        res.status(201).send(user);
})

router.get('/api/users/signup', (req:Request,res:Response) => {
    res.send('Hello from signup');
})

export {router as signupRouter}