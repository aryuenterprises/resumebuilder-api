import { Request, Response } from 'express';
import ContactMessage from '../models/ContactMessage';
import mongoose from 'mongoose';
interface Params {
  id: string;
}

interface ContactMessageBody {
  name?: string;
  email?: string;
  message?: string;
}
// Create a message
 const createMessage = async (req: Request<{},{},ContactMessageBody>, res: Response) => {
  try {
    const { name, email, message } = req.body;
    console.log(req.body);

    const newMessage = new ContactMessage({ name, email, message });
    const savedMessage = await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: savedMessage,
    });
  } catch (error: any) {
     //  Handle Mongoose validation errors
        if (error instanceof mongoose
          .Error.ValidationError) {
          const errors: Record<string, string> = {};
          for (const field in error.errors) {
            if (Object.prototype.hasOwnProperty.call(error.errors, field)) {
              errors[field] = error.errors[field].message;
            }
          }
          res.status(400).json({ success: false, errors });
          return;
        }
    res.status(400).json({ error: error.message });
  }
};

// Get all messages
 const getMessages = async (_req: Request, res: Response) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get one message by ID
 const getMessageById = async (req: Request<Params,{},{}>, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid message ID' });
  }

  try {
    const message = await ContactMessage.findById(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a message
 const deleteMessage = async (req: Request<Params,{},{}>, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid message ID' });
  }

  try {
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export {
  createMessage,
  getMessages,
  getMessageById,
  deleteMessage,
};  
