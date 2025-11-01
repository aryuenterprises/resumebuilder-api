import { Router } from 'express';
import { addUser, deleteUser, editUser, getAllUsers, getUserById, loginUser } from '../Controller/user';


const userRouter = Router();

userRouter.get('/all-user-list', getAllUsers);
userRouter.get('/particular-user/:id', getUserById);
userRouter.post('/create', addUser);
userRouter.post('/login', loginUser);
userRouter.put('/particular-user-edit/:id', editUser);
userRouter.delete('/particular-user-delete/:id', deleteUser);

export default userRouter;
