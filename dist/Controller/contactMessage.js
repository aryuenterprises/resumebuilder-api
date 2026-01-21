import ContactMessage from '../models/ContactMessage';
import mongoose from 'mongoose';
// Create a message
const createMessage = async (req, res) => {
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
    }
    catch (error) {
        //  Handle Mongoose validation errors
        if (error instanceof mongoose
            .Error.ValidationError) {
            const errors = {};
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
const getMessages = async (_req, res) => {
    try {
        const messages = await ContactMessage.find().sort({ createdAt: -1 });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get one message by ID
const getMessageById = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Delete a message
const deleteMessage = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export { createMessage, getMessages, getMessageById, deleteMessage, };
