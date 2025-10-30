// controllers/experienceController.ts
import { Request, Response } from 'express';
import { Experience } from '../models/experience';
 const createExperience = async (req: Request, res: Response) => {
    try {
        const { contactId, experiences } = req.body;

        if (!contactId || !experiences || !Array.isArray(experiences)) {
            return res.status(400).json({ message: 'contactId and experiences array are required.' });
        }

        const newExperience = new Experience({
            contactId,
            experiences,
        });

        const savedExperience = await newExperience.save();
        res.status(201).json({ message: 'Experience created successfully', data: savedExperience });
    } catch (error) {
        res.status(500).json({ message: 'Error creating experience', error });
    }
};

const updateExperience = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Experience document _id
        const { experiences } = req.body;

        const updated = await Experience.findByIdAndUpdate(
            id,
            { experiences },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        res.status(200).json({ message: 'Experience updated successfully', data: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating experience', error });
    }
};


export { createExperience, updateExperience };