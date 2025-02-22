import express from "express";
import userRouter from "../routes/userRouter.js";
import accountRouter from "../routes/accountRouter.js"

const router = express.Router();

//All Routes and their handlers should be written below:
router.use("/user", userRouter);
router.use("/account", accountRouter);

export default router;