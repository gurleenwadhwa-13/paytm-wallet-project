import express from "express";
import userRouter from "../routes/userRouter.js";

const router = express.Router();

//All Routes and their handlers should be written below:
router.use("/user", userRouter);
// router.use("/account", accountRouter);
// router.use("/transactions", transactionRouter);

export default router;