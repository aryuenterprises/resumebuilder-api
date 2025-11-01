import {Request, Response} from 'express';
import {Tone} from '../models/toneResume';
import mongoose from 'mongoose';

const createTone = async (req: Request, res: Response) => {
    try {
        const { name,status } = req.body;
        const toneResume = new Tone({ name, status });
        await toneResume.save();
        res.status(201).json(toneResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getTone = async (req: Request, res: Response) => {
    try {
        const toneResume = await Tone.find();
        res.json(toneResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editTone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const toneResume = await Tone.findById(id);
        if (!toneResume) {
            return res.status(404).json({ error: 'Tone Resume not found' });
        }
        toneResume.name = name;
        toneResume.status = status;
        await toneResume.save();
        res.json(toneResume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteTone = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const toneResume = await Tone.findByIdAndDelete(id);
        if (!toneResume) {
            return res.status(404).json({ error: 'Tone Name not found' });
        }
        res.json({ message: 'Tone Name deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    createTone,
    getTone,
    editTone,
    deleteTone
}