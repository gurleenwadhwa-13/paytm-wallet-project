import { Router } from "express";
import jwt from "jsonwebtoken";
import { User, Accounts } from "../db.js";
import { loginSchema, signUpSchema, updateBody } from "../zodSchemas/userInputSchemas.js";
import { authMiddleware } from "../middleware.js";

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

            const userId = createdUser._id;

            const createdEmail = createdUser?.email;

            await Accounts.create({
                userId: userId,
                walletBalance: 1 + Math.random() * 1000
            })

            const token = jwt.sign({createdEmail}, process.env.JWT_SECRET);

            res.status(200).json({
                token: token,
                message: "User created successfully!"
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
    //zod validations
    const {success} = loginSchema.safeParse(req.body);
    if(!success){
        return res.json({
            error: "Invalid Inputs"
        })
    }

    const { email, password } = req.body;

    try {
        //We should first check if there is valid user in our DB with the following email:
        const user = await User.findOne({email: email}).select('+password');

        if(!user || user === null || user === undefined){
            return req.status(401).json({
                error: "No User Found!"
            })
        }

        const user_email = user.email;

        //Checking if the user entered the right password for the associated account.
        // const isPasswordMatch = await user.matchPassword(password);
        var isPasswordMatch = false;
        if(password === user.password && password !== null){
            isPasswordMatch = true
        }
        if(isPasswordMatch){
            const token = jwt.sign({user_email}, process.env.JWT_SECRET);

            res.status(200).json({
                token: token,
                message: "User Logged In Successfully!"
            })
        }else{
            res.status(401).json({
                error: "Invalid Credentials"
            })
        }
    } catch (error) {
        res.status(404).json({
            error: error.errors
        })
    }
})

//update user info
router.patch("/:user_id", authMiddleware, async (req,res) => {
    const { success } = updateBody.safeParse(req.body);

    if(!success){
        return res.json({
            error: "Provided input is not valid!"
        })
    }

    const userId = req.params.user_id;

    try {
        const user = await User.findOneAndUpdate({_id: userId}, req.body, {new:true});
        if(user){
            res.status(200).json({
                message: "Field was updated!",
                user: { user }
            })
        }else{
            res.status(403).json({message: "Cannot update user!"})
        }
    } catch (error) {
        return res.status(403).json({
            error: error
        })
    }
})

//route to get all users.
router.get("/bulk", authMiddleware, async (req,res) => {
    const filter = req.query.filter || "";
    console.log(filter);
    const allUsers = await User.find({
        $or: [
            {
                firstName: { $regex: filter}
            },{
                lastName: { $regex: filter}
            },{
                email: { $regex: filter}
            }
        ]
    })

    console.log(allUsers);

    res.json({
        user : allUsers.map(user => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }))
    })
})

export default router;