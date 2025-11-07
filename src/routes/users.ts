import { Router } from 'express';
import {verifyEmail,dashboard,downloadResume, addUser, deleteUser, editUser, getAllUsers, getUserById, loginUser, forgotPassword } from '../Controller/user';
import upload from "../middlewares/upload.js";

const userRouter = Router();

userRouter.get('/all-user-list', getAllUsers);
userRouter.get('/particular-user/:id', getUserById);
userRouter.post('/create', addUser);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/login', loginUser);
userRouter.put('/particular-user-edit/:id', editUser);
userRouter.delete('/particular-user-delete/:id', deleteUser);
userRouter.get('/dashboard',dashboard);
userRouter.post('/download-resume', upload.single("resume"), downloadResume);
userRouter.get("/verify/:token", verifyEmail);

export default userRouter;
