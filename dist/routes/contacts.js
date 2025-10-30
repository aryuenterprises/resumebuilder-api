import { Router } from 'express';
import { createMessage, deleteMessage, getMessageById, getMessages } from '../Controller/contactMessage';
const contactRouter = Router();
contactRouter.post('/', createMessage); // Create
contactRouter.get('/', getMessages); // Get all
contactRouter.get('/:id', getMessageById); // Get one
contactRouter.delete('/:id', deleteMessage); // Delete
export default contactRouter;
