import {Request, Response} from 'express';
import {Summary} from '../models/summaryResume';

const createSummary = async (req: Request, res: Response) => {
    try {
        const { contactId, text } = req.body;
        const newSummary = await Summary.create({ contactId, text });
        res.status(201).json(newSummary);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const getSummaryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const summary = await Summary.find({contactId: id});
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

// const updateSummary = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const { summary } = req.body;
//         const updatedSummary = await Summary.findOneAndUpdate({ contactId: id }, { summary }, { new: true });
//         if (!updatedSummary) {
//             return res.status(404).json({ message: 'Summary not found' });
//         }
//         res.json(updatedSummary);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };

const updateSummary = async (req: Request, res: Response) => {
  try {
    const { id, contactId,templateId } = req.query;
    const { text } = req.body;

    let existingExperience;

    if (id) {
      existingExperience = await Summary.findOne({ _id: id, contactId });
    } else {
      existingExperience = await Summary.findOne({ contactId });
    }

    if (!existingExperience) {
      const newExperience = new Summary({
        contactId,
        templateId,
        text,
      });

      const savedExperience = await newExperience.save();
      return res
        .status(201)
        .json({
          message: "Summary created successfully",
          data: savedExperience,
        });
    }

    existingExperience.text = text || existingExperience.text;
    const updatedExperience = await existingExperience.save();

    res.status(200).json({
      message: "Summary updated successfully",
      data: updatedExperience,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating experience", error: error.message });
  }
};

export { createSummary, getSummaryById, getSummary, updateSummary };