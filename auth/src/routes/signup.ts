import express, {Request, Response} from 'express';
import {body,validationResult} from 'express-validator';//Sử dụng thư viện express-validator và sử dụng hàm validationResult để kiểm tra xem có lỗi của email hoặc password hay không
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';

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
    validateRequest,
    async (req:Request,res:Response) => {
        const {email,password} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser){
            throw new BadRequestError('Email in use');
        }
        const user = User.build({email,password});
        await user.save();

        //Generate JWT
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!);//! để báo cho typescript rằng chúng ta đã kiểm tra xem process.env.JWT_KEY có tồn tại hay không

        //Store it on session object
        req.session = {
            jwt: userJwt
        };
        
        res.status(201).send(user);

})

router.get('/api/users/signup', (req:Request,res:Response) => {
    res.send('Hello from signup');
})

export {router as signupRouter}