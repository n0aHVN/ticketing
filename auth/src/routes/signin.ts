import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();
const validationRules = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 4, max: 20 })
        .withMessage('Password must be between 4 and 20 characters'),
]
router.post("/api/users/signin", 
    validationRules,
    validateRequest,
    async (req:Request, res:Response) => {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (!existingUser){
            throw new BadRequestError('Email or password is not exist.');
        }
        const isPasswordMatch = await Password.compare(existingUser.password, password);
        if (!isPasswordMatch){
            throw new BadRequestError('Email or password is not exist.');
        }
        //Generate JWT
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!);
        //Store it on session object
        req.session = {
            jwt: userJwt
        };
        res.status(200).send(existingUser);
    }
);

router.get("/api/users/signin", (req, res) => {
    res.send("Hi there!");
});
export { router as signinRouter };