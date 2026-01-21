import { Router } from 'express';
import {verifyOtpAndResetPassword,verifyEmail,dashboard,downloadResume, addUser, deleteUser, editUser, getAllUsers, getUserById, loginUser, forgotPassword } from '../Controller/user';
import upload from "../middlewares/upload";

const userRouter = Router();

userRouter.get('/all-user-list', getAllUsers);
userRouter.get('/particular-user/:id', getUserById);
userRouter.post('/create', addUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/login', loginUser);
userRouter.put('/particular-user-edit/:id', editUser);
userRouter.put('/particular-user-delete/:id', deleteUser);
userRouter.get('/dashboard',dashboard);
userRouter.post('/download-resume', upload.single("resume"), downloadResume);
userRouter.get("/verify/:token", verifyEmail);
userRouter.post("/verify-otp", verifyOtpAndResetPassword);

export default userRouter;

