import { Request, Response } from "express";
import { FinalizeResume } from "../models/finalizeResume";
import { ContactResume } from "../models/ContactResume";
import { PlanSubscription } from "../models/planSubscription";
import { Education } from "../models/educationResume";
import { Experience } from "../models/experience";
import { Skill } from "../models/skillResume";
import { Summary } from "../models/summaryResume";
const createFinalizeResume = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      message: "Finalize Resume created successfully",
      data: savedResume,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: "Error creating Finalize Resume",
        error: error.message,
      });
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

// const updateFinalizeResume = async (req: Request, res: Response) => {
//   try {
//     const { id, contactId,templateId } = req.query;
//     const { skillsData } = req.body;

//     let existingExperience;

//     if (id) {
//       existingExperience = await FinalizeResume.findOne({ _id: id, contactId });
//     } else {
//       existingExperience = await FinalizeResume.findOne({ contactId });
//     }

//     if (!existingExperience) {
//       const newExperience = new FinalizeResume({
//         contactId,
//         skillsData,templateId
//       });

//       const savedExperience = await newExperience.save();
//       return res.status(201).json({
//         message: "Finalize created successfully",
//         data: savedExperience,
//       });
//     }

//     const contactResume = await ContactResume.find({contactId: contactId});

//     existingExperience.skillsData =
//       skillsData || existingExperience.skillsData;
//     const updatedExperience = await existingExperience.save();
//     contactResume.templateId=templateId;
//     await contactResume.save();

//     res.status(200).json({
//       message: "Finalize updated successfully",
//       data: updatedExperience,
//     });
//   } catch (error: any) {
//     res
//       .status(500)
//       .json({ message: "Error updating experience", error: error.message });
//   }
// };

// const updateFinalizeResume = async (req: Request, res: Response) => {
//   try {
//     const { id, contactId } = req.query;
//     const { skillsData, templateId } = req.body;

//     if (!contactId) {
//       return res.status(400).json({ message: "contactId is required" });
//     }

//     // Find existing FinalizeResume record
//     let existingExperience;
//     if (id) {
//       existingExperience = await FinalizeResume.findOne({ _id: id, contactId });
//     } else {
//       existingExperience = await FinalizeResume.findOne({ contactId });
//     }

//     // If not found, create a new record
//     if (!existingExperience) {
//       const newExperience = new FinalizeResume({
//         contactId,
//         skillsData,
//         templateId,
//       });

//       const savedExperience = await newExperience.save();

//       // ✅ Also update ContactResume templateId when creating
//       const contactResume = await ContactResume.findById({_id: contactId });
//       if (contactResume && templateId) {
//         contactResume.templateId = String(templateId);
//         await contactResume.save();
//       }
//       const experiences = await Experience.findById({contactId: contactId});
//       if (experiences && templateId) {
//         experiences.templateId = String(templateId);
//         await experiences.save();
//       }

//       const educations = await Education.findById({contactId: contactId});
//       if (educations && templateId) {
//         educations.templateId = String(templateId);
//         await educations.save();
//       }

//       const skills = await Skill.findById({contactId: contactId});
//       if (skills && templateId) {
//         skills.templateId = String(templateId);
//         await skills.save();
//       }

//       const summaries = await Summary.findById({contactId: contactId});
//       if (summaries && templateId) {
//         summaries.templateId = String(templateId);
//         await summaries.save();
//       }

//       return res.status(201).json({
//         message: "Finalize created successfully",
//         data: savedExperience,
//       });
//     }

//     // ✅ Find a single document (not array)
//     const contactResume = await ContactResume.findById({_id: contactId });
//     const experiences = await Experience.findOne({ contactId: contactId });
//     const educations = await Education.findOne({ contactId: contactId });
//     const skills = await Skill.findOne({ contactId: contactId });
//     const summaries = await Summary.findOne({ contactId: contactId });

//     // ✅ Update FinalizeResume
//     if (skillsData) existingExperience.skillsData = skillsData;
//     if (templateId) existingExperience.templateId = String(templateId);

//     const updatedExperience = await existingExperience.save();

//     // ✅ Update ContactResume templateId
//     if (templateId) {
//       contactResume.templateId = String(templateId);
//       await contactResume.save();
//       if (experiences) {
//         experiences.templateId = String(templateId);
//         await experiences.save();
//       }
//       if (educations) {
//         educations.templateId = String(templateId);
//         await educations.save();
//       }
//       if (skills) {
//         skills.templateId = String(templateId);
//         await skills.save();
//       }
//       if (summaries) {
//         summaries.templateId = String(templateId);
//         await summaries.save();
//       }
//     }

//     res.status(200).json({
//       message: "Finalize updated successfully",
//       data: updatedExperience,
//     });
//   } catch (error: any) {
//     console.error("Error updating finalize resume:", error);
//     res.status(500).json({
//       message: "Error updating experience",
//       error: error.message,
//     });
//   }
// };

const updateFinalizeResume = async (req: Request, res: Response) => {
  try {
    const { id, contactId } = req.query;
    const { skillsData, templateId } = req.body;

    if (!contactId) {
      return res.status(400).json({ message: "contactId is required" });
    }

    let existingFinalize = id
      ? await FinalizeResume.findOne({ _id: id, contactId })
      : await FinalizeResume.findOne({ contactId });

    if (!existingFinalize) {
      const newFinalize = new FinalizeResume({
        contactId,
        skillsData,
        templateId,
      });

      const savedFinalize = await newFinalize.save();

      if (templateId) {
        const contactResume = await ContactResume.findById(contactId);
        if (contactResume) {
          contactResume.templateId = String(templateId);
          await contactResume.save();
        }

        const modelsToUpdate = [Experience, Education, Skill, Summary];
        for (const Model of modelsToUpdate) {
          // Use updateMany for better performance
          await Model.updateMany(
            { contactId },
            { templateId: String(templateId) }
          );
        }
      }

      return res.status(201).json({
        message: "Finalize created successfully",
        data: savedFinalize,
      });
    }

    // ✅ If record exists, update it
    if (skillsData) existingFinalize.skillsData = skillsData;
    if (templateId) existingFinalize.templateId = String(templateId);

    const updatedFinalize = await existingFinalize.save();

    // ✅ Update templateId in related documents
    if (templateId) {
      const contactResume = await ContactResume.findById(contactId);
      if (contactResume) {
        contactResume.templateId = String(templateId);
        await contactResume.save();
      }

      const modelsToUpdate = [Experience, Education, Skill, Summary];
      for (const Model of modelsToUpdate) {
        // Use updateMany for better performance
        await Model.updateMany(
          { contactId },
          { templateId: String(templateId) }
        );
      }
    }

    return res.status(200).json({
      message: "Finalize updated successfully",
      data: updatedFinalize,
    });
  } catch (error: any) {
    console.error("Error updating finalize resume:", error);
    return res.status(500).json({
      message: "Error updating finalize resume",
      error: error.message,
    });
  }
};

const getFinalizeResumeById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const resume = await FinalizeResume.find({ contactId: id }).populate(
      "contactId"
    );

    if (!resume || resume.length === 0) {
      res.status(404).json({ message: "Finalize Resume not found" });
      return;
    }

    // const contactResume = await ContactResume.findById(id);

    // if (!contactResume) {
    //   res.status(404).json({ message: 'Contact Resume not found' });
    //   return;
    // }

    // const planSubscriptions = await PlanSubscription.find({ desiredJobTitle: contactResume.jobTitle });

    res.status(200).json({
      resume,
      // contactResume,
      // planSubscriptions,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error getting Finalize Resume", error: error.message });
  }
};

const getFinalizeResume = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const resume = await FinalizeResume.find();
    if (!resume) {
      res.status(404).json({ message: "Finalize Resume not found" });
      return;
    }
    res.json(resume);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error getting Finalize Resume", error: error.message });
  }
};

//  const upsertFullResume = async (req: Request, res: Response) => {
//   try {
//     const { id, userId, templateId, contactId } = req.query;

//     // Extract body data
//     const {
//       firstName,
//       lastName,
//       email,
//       jobTitle,
//       keywords,
//       tones,
//       phone,
//       country,
//       city,
//       address,
//       postCode,
//       linkedIn,
//       portfolio,
//       education,
//       experiences,
//       skills,
//       skillsData,
//       text,
//     } = req.body;

//     if (!userId && !contactId) {
//       return res.status(400).json({ message: "userId or contactId is required" });
//     }

//     // Use contactId if provided, otherwise userId/templateId combination
//     let contactResume;
//     if (contactId) {
//       contactResume = await ContactResume.findById(contactId);
//     } else {
//       contactResume = await ContactResume.findOne({ userId, templateId });
//     }

//     // 🟢 Step 1: Create or Update Contact Resume
//     if (!contactResume) {
//       contactResume = new ContactResume({
//         userId,
//         templateId,
//         firstName,
//         lastName,
//         email,
//         jobTitle,
//         keywords,
//         tones,
//         phone,
//         country,
//         city,
//         address,
//         postCode,
//         linkedIn,
//         portfolio,
//       });
//     } else {
//       Object.assign(contactResume, {
//         firstName,
//         lastName,
//         email,
//         jobTitle,
//         keywords,
//         tones,
//         phone,
//         country,
//         city,
//         address,
//         postCode,
//         linkedIn,
//         portfolio,
//         templateId,
//       });
//     }

//     const savedContact = await contactResume.save();
//     const contactResumeId = savedContact._id;

//     // 🟢 Step 2: Upsert Education
//     if (education) {
//       const edu = await Education.findOne({ contactId: contactResumeId });
//       if (edu) {
//         edu.education = education;
//         await edu.save();
//       } else {
//         await new Education({ contactId: contactResumeId, education }).save();
//       }
//     }

//     // 🟢 Step 3: Upsert Experience
//     if (experiences) {
//       const exp = await Experience.findOne({ contactId: contactResumeId });
//       if (exp) {
//         exp.experiences = experiences;
//         await exp.save();
//       } else {
//         await new Experience({ contactId: contactResumeId, experiences }).save();
//       }
//     }

//     // 🟢 Step 4: Upsert Skills
//     if (skills) {
//       const skill = await Skill.findOne({ contactId: contactResumeId });
//       if (skill) {
//         skill.skills = skills;
//         await skill.save();
//       } else {
//         await new Skill({ contactId: contactResumeId, skills }).save();
//       }
//     }

//     // 🟢 Step 5: Upsert Summary
//     if (text) {
//       const summary = await Summary.findOne({ contactId: contactResumeId });
//       if (summary) {
//         summary.text = text;
//         await summary.save();
//       } else {
//         await new Summary({ contactId: contactResumeId, text }).save();
//       }
//     }

//     // 🟢 Step 6: Upsert Finalize Resume (skillsData/templateId)
//     if (skillsData || templateId) {
//       const finalize = await FinalizeResume.findOne({ contactId: contactResumeId });
//       if (finalize) {
//         if (skillsData) finalize.globalSkillsData = skillsData;
//         if (templateId) finalize.templateId = String(templateId);
//         await finalize.save();
//       } else {
//         await new FinalizeResume({
//           contactId: contactResumeId,
//           skillsData,
//           templateId: String(templateId),
//         }).save();
//       }
//     }

//     // ✅ Final Response
//     res.status(200).json({
//       message: "All resume sections processed successfully",
//       data: {
//         contactResume: savedContact,
//         contactId: contactResumeId,
//       },
//     });
//   } catch (error: any) {
//     console.error("Error in upsertFullResume:", error);
//     res.status(500).json({
//       message: "Error processing resume data",
//       error: error.message,
//     });
//   }
// };

export {
  createFinalizeResume,
  updateFinalizeResume,
  getFinalizeResumeById,
  getFinalizeResume,
};
