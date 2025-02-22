import { Router } from "express";
import { User, Accounts } from "../db.js";
import { authMiddleware } from "../middleware.js";
import { startSession } from "mongoose";

const router = Router();

//Endpoint: GET user balance
router.get("/balance/:user_id", authMiddleware, async (req, res) => {
    const userId = req.params.user_id;

    const userAccount = await Accounts.findOne({
        userId: userId
    });

    if(userAccount){
        res.status(200).json({
            userId: userAccount.userId,
            walletBalance: userAccount.walletBalance
        })
    }
})

router.post("/transfer", authMiddleware, async (req,res) => {
    const myEmail = req.email;
    const session = await startSession();

    try {
        // Start transaction
        session.startTransaction();
        const {amount, to} = req.body;

        // We first need to check that this account exists
        const currentUser = await User.findOne({email: myEmail}).session(session);
        console.log(currentUser);

        const myAccount = await Accounts.findOne({userId: currentUser._id}).session(session);
        console.log(myAccount);

        // Checking that account has enough wallet balance to process transaction
        if(!myAccount|| myAccount.walletBalance < amount){
            await session.abortTransaction();
            return res.status(403).json({
                message: "Insufficient Funds"
            });
        }

        // Now lets validate that the reciever's email is connected to a valid account
        const reciever = await User.findOne({email: to}).session(session);

        if(!reciever){
            await session.abortTransaction();
            return res.status(403).json({
                error: "The Account you're sending money to doesn't exist."
            })
        }

        // If we reached till here that means receiver account is valid and sender has enough money.
        // Transaction can proceed:
        await Accounts.updateOne({userId: myAccount.userId}, { $inc: {walletBalance: -amount} }).session(session);
        await Accounts.updateOne({userId: reciever._id}, {$inc: {walletBalance: amount} }).session(session);

        //Commiting Transaction
        await session.commitTransaction();
        res.status(200).json({
            message: "Transaction Successful"
        });
    } catch (error) {
        await session.abortTransaction();
        res.status(411).json({
            error: "There was an error, please try again!"
        })
    }
})

export default router;