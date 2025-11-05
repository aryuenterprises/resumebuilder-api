// controllers/experienceController.ts
import { Request, Response } from 'express';
import { Education } from '../models/educationResume';
 const createEducation = async (req: Request, res: Response) => {
    try {
        const { contactId, education } = req.body;

        if (!contactId || !education || !Array.isArray(education)) {
            return res.status(400).json({ message: 'contactId and education array are required.' });
        }

        const newEducation = new Education({
            contactId,
            education,
        });

        const savedEducation = await newEducation.save();
        res.status(201).json({ message: 'Experience created successfully', data: savedEducation });
    } catch (error) {
        res.status(500).json({ message: 'Error creating experience', error });
    }
};

// const updateEducation = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params; // Experience document _id
//         const { education } = req.body;

//         const updated = await Education.findByIdAndUpdate(
//             id,
//             { education },
//             { new: true }
//         );

//         if (!updated) {
//             return res.status(404).json({ message: 'Experience not found' });
//         }

//         res.status(200).json({ message: 'Experience updated successfully', data: updated });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating experience', error });
//     }
// };
const updateEducation = async (req: Request, res: Response) => {
  try {
    const { id, contactId, templateId } = req.query;
    const { education } = req.body;

    let existingExperience;

    if (id) {
      existingExperience = await Education.findOne({ _id: id, contactId });
    } else {
      existingExperience = await Education.findOne({ contactId });
    }

    if (!existingExperience) {
      const newExperience = new Education({
        contactId,
        templateId,
        education,
      });

      const savedExperience = await newExperience.save();
      return res
        .status(201)
        .json({
          message: "Education created successfully",
          data: savedExperience,
        });
    }

    existingExperience.education = education || existingExperience.education;
    const updatedExperience = await existingExperience.save();

    res.status(200).json({
      message: "Education updated successfully",
      data: updatedExperience,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating experience", error: error.message });
  }
};
const getEducationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const education = await Education.find({ contactId: id });
        if (!education) {
            return res.status(404).json({ message: 'Education not found' });
        }
        res.json(education);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
const getEducation= async (req: Request, res: Response) => {
    try {
        const education = await Education.find();
        if (!education) {
            return res.status(404).json({ message: 'Education not found' });
        }
        res.json(education);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export { createEducation, updateEducation, getEducationById, getEducation };