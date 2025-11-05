// controllers/experienceController.ts
import { Request, Response } from 'express';
import { Skill } from '../models/skillResume';
 const createSkill = async (req: Request, res: Response) => {
    try {
        const { contactId, skills } = req.body;

        if (!contactId || !skills || !Array.isArray(skills)) {
            return res.status(400).json({ message: 'contactId and skills array are required.' });
        }

        const newSkill = new Skill({
            contactId,
            skills,
        });

        const savedSkills = await newSkill.save();
        res.status(201).json({ message: 'Experience created successfully', data: savedSkills });
    } catch (error) {
        res.status(500).json({ message: 'Error creating experience', error });
    }
};

// const updateSkill = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params; // Experience document _id
//         const { skills } = req.body;

//         const updated = await Skill.findByIdAndUpdate(
//             id,
//             { skills },
//             { new: true }
//         );

//         if (!updated) {
//             return res.status(404).json({ message: 'Skills not found' });
//         }

//         res.status(200).json({ message: 'Skills updated successfully', data: updated });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating experience', error });
//     }
// };


const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id, contactId, templateId } = req.query;
    const { skills } = req.body;

    let existingExperience;

    if (id) {
      existingExperience = await Skill.findOne({ _id: id, contactId });
    } else {
      existingExperience = await Skill.findOne({ contactId });
    }

    if (!existingExperience) {
      const newExperience = new Skill({
        contactId,
        templateId,
        skills,
      });

      const savedExperience = await newExperience.save();
      return res
        .status(201)
        .json({
          message: "Experience created successfully",
          data: savedExperience,
        });
    }

    existingExperience.skills = skills || existingExperience.skills;
    const updatedExperience = await existingExperience.save();

    res.status(200).json({
      message: "Experience updated successfully",
      data: updatedExperience,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating experience", error: error.message });
  }
};
const getSkillById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const Skills = await Skill.find({ contactId: id });
        if (!Skills) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(Skills);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
const getSkill= async (req: Request, res: Response) => {
    try {
        const skills = await Skill.find();
        if (!skills) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(skills);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};


export { createSkill, updateSkill, getSkillById, getSkill };