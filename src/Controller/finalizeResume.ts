import { Request, Response } from 'express';
import { FinalizeResume } from '../models/finalizeResume';

const createFinalizeResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      contactId,
      languages,
      certificationsAndLicenses,
      hobbiesAndInterests,
      awardsAndHonors,
      websitesAndSocialMedia,
      references,
      customSection,
    } = req.body;

    const finalizeResume = new FinalizeResume({
      contactId,
      languages,
      certificationsAndLicenses,
      hobbiesAndInterests,
      awardsAndHonors,
      websitesAndSocialMedia,
      references,
      customSection,
    });

    const savedResume = await finalizeResume.save();
    res.status(201).json({
      message: 'Finalize Resume created successfully',
      data: savedResume,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating Finalize Resume', error: error.message });
  }
};

// const updateFinalizeResume = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;

//     const updatedResume = await FinalizeResume.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedResume) {
//       res.status(404).json({ message: 'Finalize Resume not found' });
//       return;
//     }

//     res.status(200).json({
//       message: 'Finalize Resume updated successfully',
//       data: updatedResume,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: 'Error updating Finalize Resume', error: error.message });
//   }
// };


const updateFinalizeResume = async (req: Request, res: Response) => {
  try {
    const { id, contactId } = req.query;
    const { globalSkillsData } = req.body;

    let existingExperience;

    if (id) {
      existingExperience = await FinalizeResume.findOne({ _id: id, contactId });
    } else {
      existingExperience = await FinalizeResume.findOne({ contactId });
    }

    if (!existingExperience) {
      const newExperience = new FinalizeResume({
        contactId,
        globalSkillsData,
      });

      const savedExperience = await newExperience.save();
      return res.status(201).json({
        message: "Finalize created successfully",
        data: savedExperience,
      });
    }

    existingExperience.globalSkillsData =
      globalSkillsData || existingExperience.globalSkillsData;
    const updatedExperience = await existingExperience.save();

    res.status(200).json({
      message: "Finalize updated successfully",
      data: updatedExperience,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating experience", error: error.message });
  }
};
const getFinalizeResumeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resume = await FinalizeResume.find({ contactId: id });
    if (!resume) {
      res.status(404).json({ message: 'Finalize Resume not found' });
      return;
    }
    res.json(resume);
  } catch (error: any) {
    res.status(500).json({ message: 'Error getting Finalize Resume', error: error.message });
  }
};
const getFinalizeResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await FinalizeResume.find();
    if (!resume) {
      res.status(404).json({ message: 'Finalize Resume not found' });
      return;
    }
    res.json(resume);
  } catch (error: any) {
    res.status(500).json({ message: 'Error getting Finalize Resume', error: error.message });
  }
};


export { createFinalizeResume, updateFinalizeResume, getFinalizeResumeById, getFinalizeResume };