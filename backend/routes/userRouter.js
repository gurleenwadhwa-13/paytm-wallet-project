import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../db.js";
import { signUpSchema } from "../zodSchemas/inputSchemas.js";

const router = Router();

//Sign up endpoint
router.post("/signup", async (req,res) => {
    const {success} = signUpSchema.safeParse(req.body);
    if(!success){
        return res.json({
            error: "Invalid inputs"
        })
    }

    const {email, password, firstName, lastName} = req.body;

    try {
        // We first gotta check that a user already does not exists:
        const queryResults = await User.findOne({email: email});
        if(!queryResults){
            const createdUser = await User.create({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            });

            const token = jwt.sign({email}, process.env.JWT_SECRET);

            res.status(200).json({
                token: token,
                message: "User Created Successfully!"
            });
        }else{
            return res.status(409).json({
                message: "Email already registered to another account, User cannot be created! Use another email."
            })
        }
    } catch (error) {
        res.status(403).json({
            "error": "Internal Server Error! Try Again later"
        })
    }
})

// Login endpoint
router.post("/login", async (req,res) => {
    const { email, password } = req.body;
    // const authorization= req.headers.authorization;

    try {
        //We should first check if there is valid user in our DB with the following email:
        const user = await User.findOne({email: email}).select('+password');

        if(!user || user === null || user === undefined){
            return req.status(401).json({
                error: "No User Found!"
            })
        }

        //Checking if the user entered the right password for the associated account.
        // const isPasswordMatch = await user.matchPassword(password);
        var isPasswordMatch = false;
        if(password === user.password && password !== null){
            isPasswordMatch = true
        }
        if(isPasswordMatch){
            // var token = jwt.sign({email}, process.env.JWT_SECRET);

            res.status(200).json({
                // token: token,
                message: "User Logged In Successfully!"
            })
        }else{
            res.status(401).json({
                error: "Invalid Credentials"
            })
        }
    } catch (error) {
        res.status(404).json({
            error: error
        })
    }
})

// //update user info
// router.put("api/update_user/:user_id", authMiddleware, async (req,res) => {

// })

export default router;