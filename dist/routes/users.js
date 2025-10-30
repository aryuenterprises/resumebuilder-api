import { Router } from 'express';
import { addUser, deleteUser, editUser, getAllUsers, getUserById } from '../Controller/user';
const userRouter = Router();
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', addUser);
userRouter.put('/:id', editUser);
userRouter.delete('/:id', deleteUser);
export default userRouter;
