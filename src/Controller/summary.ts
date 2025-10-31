import {Request, Response} from 'express';
import {Summary} from '../models/summaryResume';

const createSummary = async (req: Request, res: Response) => {
    try {
        const { contactId, summary } = req.body;
        const newSummary = await Summary.create({ contactId, summary });
        res.status(201).json(newSummary);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const getSummaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const summary = await Summary.findById({contactId: id});
        if (!summary) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.json(summary);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
const getSummary = async (req: Request, res: Response) => {
    try {
        const summary = await Summary.find();
        if (!summary) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.json(summary);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const updateSummary = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { summary } = req.body;
        const updatedSummary = await Summary.findOneAndUpdate({ contactId: id }, { summary }, { new: true });
        if (!updatedSummary) {
            return res.status(404).json({ message: 'Summary not found' });
        }
        res.json(updatedSummary);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export { createSummary, getSummaryById, getSummary, updateSummary };