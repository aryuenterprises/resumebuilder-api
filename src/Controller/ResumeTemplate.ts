import {Request, Response} from 'express';
import {ResumeTemplate} from '../models/ResumeTemplate';
import mongoose from 'mongoose';

const createResumeTemplate = async (req: Request, res: Response) => {
    try {
        const { name,status } = req.body;
        const desiredJobTitle = new ResumeTemplate({ name, status });
        await desiredJobTitle.save();
        res.status(201).json(desiredJobTitle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getResumeTemplate = async (req: Request, res: Response) => {
    try {
        const desiredJobTitle = await ResumeTemplate.find();
        res.json(desiredJobTitle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editResumeTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const desiredJobTitle = await ResumeTemplate.findById(id);
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

const deleteResumeTemplate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const desiredJobTitle = await ResumeTemplate.findByIdAndDelete(id);
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
    createResumeTemplate,
    getResumeTemplate,
    editResumeTemplate,
    deleteResumeTemplate
}