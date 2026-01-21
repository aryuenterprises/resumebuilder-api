import { Router } from 'express';
import { createMessage, deleteMessage, getMessageById, getMessages } from '../Controller/contactMessage';


const contactRouter = Router();

contactRouter.post('/create', createMessage);          // Create
contactRouter.get('/all-lsit', getMessages);             // Get all
contactRouter.get('/particular-message:id', getMessageById);       // Get one
contactRouter.delete('/particular-message-delete:id', deleteMessage);     // Delete

export default contactRouter;
