import {Request, Response} from 'express';
import {Keyboard} from '../models/keyboardResume';
import mongoose from 'mongoose';

const createKeyboard = async (req: Request, res: Response) => {
    try {
        const { name,status } = req.body;
        const keyboardResume = new Keyboard({ name,status });
        await keyboardResume.save();
        res.status(201).json(keyboardResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getKeyboard = async (req: Request, res: Response) => {
    try {
        const keyboardResume = await Keyboard.find();
        res.json(keyboardResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editKeyboard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const keyboardResume = await Keyboard.findById(id);
        if (!keyboardResume) {
            return res.status(404).json({ error: 'Keyboard Resume not found' });
        }
        keyboardResume.name = name;
        keyboardResume.status = status;
        await keyboardResume.save();
        res.json(keyboardResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteKeyboard = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const keyboardResume = await Keyboard.findByIdAndDelete(id);
        if (!keyboardResume) {
            return res.status(404).json({ error: 'Keyboard Name not found' });
        }
        res.json({ message: 'Keyboard Name deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    createKeyboard,
    getKeyboard,
    editKeyboard,
    deleteKeyboard
}