// controllers/experienceController.ts
import { Request, Response } from "express";
import { Experience } from "../models/experience";
import { Education } from "../models/educationResume";
import { ContactResume } from "../models/ContactResume";
import { Skill } from "../models/skillResume";
import { Summary } from "../models/summaryResume";
import { FinalizeResume } from "../models/finalizeResume";
import { text } from "stream/consumers";
import { PlanSubscription } from "@models/planSubscription";
import { Payment } from "@models/paymentModel";
import { User } from "@models/User";
const createExperience = async (req: Request, res: Response) => {
  try {
    const { contactId, experiences } = req.body;

    if (!contactId || !experiences || !Array.isArray(experiences)) {
      return res
        .status(400)
        .json({ message: "contactId and experiences array are required." });
    }

    const newExperience = new Experience({
      contactId,
      experiences,
    });

    const savedExperience = await newExperience.save();
    res.status(201).json({
      message: "Experience created successfully",
      data: savedExperience,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating experience", error });
  }
};

// const updateExperience = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params; // Experience document _id
//         const { experiences } = req.body;

//         const updated = await Experience.findByIdAndUpdate(
//             id,
//             { experiences },
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

const getExperienceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const experience = await Experience.find({ contactId: id });
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id, contactId, templateId } = req.query;
    const { experiences } = req.body;

    let existingExperience;

    if (id) {
      existingExperience = await Experience.findOne({ _id: id, contactId });
    } else {
      existingExperience = await Experience.findOne({ contactId });
    }

    if (!existingExperience) {
      const newExperience = new Experience({
        contactId,
        templateId,
        experiences,
      });

      const savedExperience = await newExperience.save();
      return res.status(201).json({
        message: "Experience created successfully",
        data: savedExperience,
      });
    }

    existingExperience.experiences =
      experiences || existingExperience.experiences;
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

const getAllContacts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // const contacts = await ContactResume.find({ _id: id }).lean();
    // const planSubscriptions = await PlanSubscription.findOne({desiredJobTitle: contacts.jobTitle});
    const contacts = await ContactResume.find({ _id: id })
      // .populate("userId")
      .populate("jobTitle")
      .lean();
    const contactResume = await ContactResume.findById(id)
    let hasResume: boolean = false;

    if (contactResume && contactResume.resume && contactResume.resume.trim() !== "") {
      hasResume = true;
    }

    console.log("Resume Exists:", hasResume);

    const planSubscriptions = (
      await Promise.all(
        contacts.map(async (contact) => {
          const planSubscription = await Payment.findOne({
            userId: contact.userId,
          });
          return planSubscription;
        })
      )
    ).filter((ps): ps is NonNullable<typeof ps> => ps !== null);
    const experiences = await Experience.find().lean();
    const educations = await Education.find().lean();
    const skills = await Skill.find().lean();
    const summary = await Summary.find().lean();
    const finalizeResumes = await FinalizeResume.find().lean();

    const result = contacts.map((contact) => {
      const contactIdStr = contact._id.toString();

      const contactExperiences = experiences
        .filter((exp) => exp.contactId?.toString() === contactIdStr)
        .map((exp) => exp.experiences)
        .flat();

      const contactEducations = educations
        .filter((edu) => edu.contactId?.toString() === contactIdStr)
        .map((edu) => edu.education)
        .flat();

      const contactSkills = skills
        .filter((skill) => skill.contactId?.toString() === contactIdStr)
        .map((skill) => skill.skills)
        .flat();

      const contactSummary = summary
        .filter((summary) => summary.contactId?.toString() === contactIdStr)
        .map((summary) => summary.text)
        .flat();

      const finalize = finalizeResumes
        .filter(
          (finalizeResumes) =>
            finalizeResumes.contactId?.toString() === contactIdStr
        )
        .map((finalizeResumes) => finalizeResumes.skillsData)
        .flat();

      return {
        contact,
        experiences: contactExperiences,
        educations: contactEducations,
        skills: contactSkills,
        summary: contactSummary,
        finalize: finalize,
        planSubscriptions: planSubscriptions,
        hasResume: hasResume,
      };
    });

    res.status(200).json({
      success: true,
      message:
        "All contacts with experiences and educations fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};
const getUserContacts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // const contacts = await ContactResume.find({ _id: id }).lean();
    // const planSubscriptions = await PlanSubscription.findOne({desiredJobTitle: contacts.jobTitle});
    const user = await User.findById(id).select("firstName lastName email");
    const contacts = await ContactResume.find({ userId: id })

      // .populate("userId")
      .populate("jobTitle")
      .lean();
    // console.log("Contacts:", contacts);
    const planSubscriptions = await Promise.all(
      contacts.map(async (contact) => {
        const planSubscription = await Payment.findOne({
          userId: contact.userId,
        });
        return planSubscription;
      })
    );
    const experiences = await Experience.find().lean();
    const educations = await Education.find().lean();
    const skills = await Skill.find().lean();
    const summary = await Summary.find().lean();
    const finalizeResumes = await FinalizeResume.find().lean();

    const result = contacts.map((contact) => {
      const contactIdStr = contact._id.toString();

      const contactExperiences = experiences
        .filter((exp) => exp.contactId?.toString() === contactIdStr)
        .map((exp) => exp.experiences)
        .flat();

      const contactEducations = educations
        .filter((edu) => edu.contactId?.toString() === contactIdStr)
        .map((edu) => edu.education)
        .flat();

      const contactSkills = skills
        .filter((skill) => skill.contactId?.toString() === contactIdStr)
        .map((skill) => skill.skills)
        .flat();

      const contactSummary = summary
        .filter((summary) => summary.contactId?.toString() === contactIdStr)
        .map((summary) => summary.text)
        .flat();

      const finalize = finalizeResumes
        .filter(
          (finalizeResumes) =>
            finalizeResumes.contactId?.toString() === contactIdStr
        )
        .map((finalizeResumes) => finalizeResumes.skillsData)
        .flat();

      return {
        contact,
        experiences: contactExperiences,
        educations: contactEducations,
        skills: contactSkills,
        summary: contactSummary,
        finalize: finalize,
        planSubscriptions: {
          planId:
            planSubscriptions.find(
              (ps) => ps?.userId?.toString() === contact.userId.toString()
            )?.planId || null,
          status:
            planSubscriptions.find(
              (ps) => ps?.userId?.toString() === contact.userId.toString()
            )?.status || "none",
          amount:
            planSubscriptions.find(
              (ps) => ps?.userId?.toString() === contact.userId.toString()
            )?.amount || 0,
          paymentDetails:
            planSubscriptions.find(
              (ps) => ps?.userId?.toString() === contact.userId.toString()
            )?.paymentDetails || null,
        },
      };
    });

    res.status(200).json({
      success: true,
      message:
        "All contacts with experiences and educations fetched successfully",
      data: result,
      user: user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};

export {
  getAllContacts,
  createExperience,
  updateExperience,
  getExperienceById,
  getUserContacts,
};
