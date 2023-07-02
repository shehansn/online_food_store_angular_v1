import { User, UserModel } from './../models/user.model';
import { Router } from 'express'
import { sample_users } from '../data';
const router = Router();
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import bcrypt from 'bcryptjs'

//http://localhost:5000/api/users/seed
router.get("/seed", asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send("Seed is already done!");
            return;
        } else {
            await UserModel.create(sample_users);
            res.send("Seed is done Successfully!");
        }
    }
));


router.get("/", async (req, res) => {
    const users = await UserModel.find();
    res.send(users)
});

router.post("/login", asyncHandler(
    async (req, res) => {
        const { email, password } = req.body; //destructuring assignment
        const user = await UserModel.findOne({ email, password });
        if (user) {
            res.send(generateTokenResponse(user));
        } else {

            res.send(HTTP_BAD_REQUEST).send("User Not Found");
            return;
        }
    })
);

router.post("/register", asyncHandler(
    async (req, res) => {
        const { name, email, password, address } = req.body; //destructuring assignment
        const user = await UserModel.findOne({ email })
        //const user = await UserModel.findOne({ email, password });
        if (user) {
            res.send(HTTP_BAD_REQUEST).send("User Already Exist, Please Login!");
            return;
        } else {
            const encryptedPassword = await bcrypt.hash(password, 10);
            const newUser: User = {
                id: '',
                email: email.toLowerCase(),
                password: encryptedPassword,
                name,
                address,
                isAdmin: false
            }
            const dbUser = await UserModel.create(newUser);
            res.send(generateTokenResponse(dbUser))
            //res.send(dbUser);
        }
    })
);

const generateTokenResponse = (user: any) => {
    const token = jwt.sign(
        {
            email: user.email,
            isAdmin: user.isAdmin
        },
        "secretToken",
        { expiresIn: '1d' }
    );
    user.token = token;
    return user
}


export default router;
