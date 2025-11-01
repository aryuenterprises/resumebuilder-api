import {Request, Response} from 'express';
import {DesiredJobTitle} from '../models/desiredJobTitle';
import mongoose from 'mongoose';

const createDesiredJobTitle = async (req: Request, res: Response) => {
    try {
        const { name,status } = req.body;
        const desiredJobTitle = new DesiredJobTitle({ name, status });
        await desiredJobTitle.save();
        res.status(201).json(desiredJobTitle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getDesiredJobTitle = async (req: Request, res: Response) => {
    try {
        const desiredJobTitle = await DesiredJobTitle.find();
        res.json(desiredJobTitle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editDesiredJobTitle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const desiredJobTitle = await DesiredJobTitle.findById(id);
        if (!desiredJobTitle) {
            return res.status(404).json({ error: 'Desired job title not found' });
        }
        desiredJobTitle.name = name;
        desiredJobTitle.status = status;
        await desiredJobTitle.save();
        res.json(desiredJobTitle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteDesiredJobTitle = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const desiredJobTitle = await DesiredJobTitle.findByIdAndDelete(id);
        if (!desiredJobTitle) {
            return res.status(404).json({ error: 'Desired job title not found' });
        }
        res.json({ message: 'Desired job title deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    createDesiredJobTitle,
    getDesiredJobTitle,
    editDesiredJobTitle,
    deleteDesiredJobTitle
}