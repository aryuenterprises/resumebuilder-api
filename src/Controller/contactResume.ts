import { Request, Response } from "express";
import { ContactResume } from "../models/ContactResume";
import mongoose from "mongoose";
import { Experience } from "../models/experience";
import { Skill } from "../models/skillResume";
import { Summary } from "../models/summaryResume";
import { FinalizeResume } from "../models/finalizeResume";
import { Education } from "../models/educationResume";

// const getContactResume = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const resumes = await ContactResume.find({ userId: id });
//     res.json(resumes);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getContactResume = async (req: Request, res: Response) => {
//   const { id, resumeId } = req.params;

//   try {
//     // if (!id) {
//     //   return res.status(400).json({ message: "User ID is required" });
//     // }
//     if(resumeId.length > 0){
//       const resume = await ContactResume.findById(resumeId);
//       if (!resume) {
//         return res.status(404).json({ message: "Resume not found" });
//       }
//     }else{
//     const resumes = await ContactResume.find({
//       userId: id,
//       resumeStatus: "pending",
//     }).sort({ createdAt: -1 });
//     }
//     // if (!resumes || resumes.length === 0) {
//     //   return res.status(404).json({ message: "No pending resumes found" });
//     // }

//     res.json(resumes);
//   } catch (error: any) {
//     console.error("Error fetching contact resumes:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };

// const getContactResume = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { resumeId } = req.query;

//   try {
//     if (resumeId) {
//       const resumes = await ContactResume.findById(resumeId);

//       // if (!resume) {
//       //   return res.status(404).json({ message: "Resume not found" });
//       // }

//       return res.json(resumes);
//     }

//     const resumes = await ContactResume.find({
//       userId: id,
//       resumeStatus: "pending",
//     }).sort({ createdAt: -1 });

//     return res.json(resumes);
//   } catch (error: any) {
//     console.error("Error fetching contact resumes:", error);
//     res.status(500).json({
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const allContactResume = async (req: Request, res: Response) => {
//   const { id } = req.params;

//   try {
//     // if (!id) {
//     //   return res.status(400).json({ message: "User ID is required" });
//     // }

//     const resumes = await ContactResume.find({
//       userId: id,
//       // resumeStatus: "pending",
//     }).sort({ createdAt: -1 });

//     // if (!resumes || resumes.length === 0) {
//     //   return res.status(404).json({ message: "No pending resumes found" });
//     // }

//     res.json(resumes);
//   } catch (error: any) {
//     console.error("Error fetching contact resumes:", error);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };
const allContactResume = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const {templateId} = req.query;

  try {
    const resumes = await ContactResume.find({
      userId: id,
      // templateId: templateId,
    }).sort({ createdAt: -1 });

    const experience = await Experience.find({
      contactId: resumes?.[0]?._id,
    }).sort({ createdAt: -1 });

    const educations = await Education.find({
      contactId: resumes?.[0]?._id,
    }).sort({ createdAt: -1 });
    
    const skills = await Skill.find({ contactId: resumes?.[0]?._id }).sort({
      createdAt: -1,
    });
    
    const summary = await Summary.find({ contactId: resumes?.[0]?._id }).sort({
      createdAt: -1,
    });
    
    const finalizeResumes = await FinalizeResume.find({
      contactId: resumes?.[0]?._id,
    }).sort({ createdAt: -1 });

    const formattedAll = resumes.map((resume) => ({
      ...resume.toObject(),
      experience,
      educations,
      skills,
      summary,
      finalizeResumes,
    }));

    const formattedOrder = formattedAll.map((data) => ({
      templateId: data?.templateId,
      contact: {
        _id: data?._id,
        userId: data?.userId,
        firstName: data?.firstName,
        lastName: data?.lastName,
        templateId: data?.templateId,
        email: data?.email,
        jobTitle: data?.jobTitle,
        keywords: data?.keywords || [],
        tones: data?.tones || [],
        phone: data?.phone,
        country: data?.country,
        city: data?.city,
        address: data?.address,
        postCode: data?.postCode,
        linkedIn: data?.linkedIn,
        portfolio: data?.portfolio,
        resumeStatus: data?.resumeStatus,
        __v: data?.__v,
      },
      
      // Map all experiences
      experiences:
        data?.experience?.[0]?.experiences?.map((exp: any) => ({
          jobTitle: exp?.jobTitle,
          employer: exp?.employer,
          location: exp?.location,
          startDate: exp?.startDate,
          endDate: exp?.endDate,
          text: exp?.text,
          _id: exp?._id,
        })) || [],

      // Map all educations
      educations:
        data?.educations?.[0]?.education?.map((edu: any) => ({
          schoolname: edu?.schoolname,
          location: edu?.location,
          degree: edu?.degree,
          startDate: edu?.startDate,
          endDate: edu?.endDate,
          text: edu?.text,
          _id: edu?._id,
        })) || [],

      // Map all skills
      skills:
        data?.skills?.[0]?.skills?.map((skill: any) => ({
          skill: skill?.skill,
          level: skill?.level,
          _id: skill?._id,
        })) || [],

      summary: data?.summary?.[0]?.text || "-",
      
      finalize: data?.finalizeResumes?.map((finalize: any) => ({
        certificationsAndLicenses: finalize?.skillsData?.certificationsAndLicenses?.map((certification: any) => ({
          name: certification?.name,
          _id: certification?._id,
        })) || [],
        hobbiesAndInterests: finalize?.skillsData?.hobbiesAndInterests?.map((hobbies: any) => ({
          name: hobbies?.name,
          _id: hobbies?._id,
        })) || [],
        awardsAndHonors: finalize?.skillsData?.awardsAndHonors?.map((awards: any) => ({
          name: awards?.name,
          _id: awards?._id,
        })) || [],
        customSection: finalize?.skillsData?.customSection?.map((custom: any) => ({
          name: custom?.name,
          description: custom?.description,
          _id: custom?._id,
        })) || []
      })) || []
    }));

    res.json(formattedOrder);
  } catch (error: any) {
    console.error("Error fetching contact resumes:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const getAllContactResume = async (req: Request, res: Response) => {
  try {
    const resumes = await ContactResume.find();
    res.json(resumes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const createContactResume = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const photoFile = req.files?.find((file) => file.fieldname === "photo");
    const photo = photoFile ? photoFile.filename : null;

    const {
      userId,
      firstName,
      lastName,
      email,
      jobTitle,
      keywords,
      tones,
      phone,
      country,
      city,
      address,
      postCode,
      linkedIn,
      portfolio,
    } = req.body;

    const contactResume = new ContactResume({
      userId,
      firstName,
      lastName,
      email,
      jobTitle,
      keywords,
      tones,
      phone,
      country,
      city,
      address,
      postCode,
      linkedIn,
      portfolio,
    });

    const saved = await contactResume.save();

    return res.status(201).json(saved);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

// GET contact resumes
const getContactResume = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { resumeId, templateId } = req.query;

  try {
    if (resumeId) {
      const resume = await ContactResume.findOne({ _id: resumeId});
      // if(templateId != resume?.templateId){
      //   return res.status(202).json({ 
      //     success: true,
      //     data:[],
      //     message: "No resume found"
      //   });
      // }

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      return res.json(resume);
    }

    const resumes = await ContactResume.findOne({
      userId: id,
      // templateId: templateId,
      // resumeStatus: "pending",
    }).sort({ createdAt: -1 });

    return res.json(resumes);
  } catch (error: any) {
    console.error("Error fetching contact resumes:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

interface MulterFile {
  filename: string;
  path: string;
  mimetype: string;
  size: number;
}

// generate unique resume ID
const generateUniqueResumeId = async (userId) => {
  const prefix = 'RES';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  let baseId = `${prefix}-${timestamp}-${random}`;
  
  let existing = await ContactResume.findOne({ resumeId: baseId });
  let counter = 1;
  
  while (existing) {
    baseId = `${prefix}-${timestamp}-${random}-${counter}`;
    existing = await ContactResume.findOne({ resumeId: baseId });
    counter++;
  }
  
  return baseId;
};

const updateResume = async (req: Request, res: Response) => {
  try {
    const { id, userId, templateId, type, resume } = req.query;

  
    const {
      firstName,
      lastName,
      email,
      jobTitle,
      keywords,
      tones,
      phone,
      country,
      city,
      address,
      postCode,
      linkedIn,
      portfolio,
      resumeId
    } = req.body;

    let existingResume;
    const existingResumeDoc = await ContactResume.find({ userId, resumeId: resume });
    console.log("Resume ID from query:", existingResumeDoc);
    console.log("Existing Resumes for User:", existingResumeDoc.some(doc => doc.resumeId === resume));

    if (id && templateId && userId && existingResumeDoc.some(doc => doc.resumeId === resume)) {
      existingResume = await ContactResume.findOne({ _id: id, userId });
    } else if (id) {
      existingResume = await ContactResume.findOne({ _id: id, userId });
    } 
    // else {
    //   existingResume = await ContactResume.findOne({
    //     userId,
    //     resumeStatus: "pending",
    //   }).sort({ createdAt: -1 });
    // }

    const shouldCreateNew = !existingResume || 
      (resume && existingResumeDoc.some(doc => doc.resumeId !== resume));

    if (shouldCreateNew) {
      const uniqueResumeId = await generateUniqueResumeId(userId);
      
      const newResume: any = new ContactResume({
        userId,
        templateId,
        resumeId: uniqueResumeId,
        firstName,
        lastName,
        email,
        jobTitle,
        keywords,
        tones,
        phone,
        country,
        city,
        address,
        postCode,
        linkedIn,
        portfolio,
      });

      const photoFile = req.file as MulterFile | undefined;
      if (photoFile) {
        newResume.photo = photoFile.filename;
      }

      const savedResume = await newResume.save();

      return res.status(201).json({
        message: "Resume created successfully",
        resume: savedResume,
      });
    }

    // Update existing resume
    const updateData: Record<string, any> = {
      firstName,
      lastName,
      email,
      jobTitle,
      keywords,
      tones,
      phone,
      country,
      city,
      address,
      postCode,
      linkedIn,
      portfolio,
      templateId,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const photoFile = req.file as MulterFile | undefined;
    if (photoFile) {
      updateData.photo = photoFile.filename;
    }

    Object.assign(existingResume, updateData);
    const updatedResume = await existingResume.save();

    return res.status(200).json({
      message: "Resume updated successfully",
      resume: updatedResume,
    });
  } catch (error: any) {
    console.error("Error updating/creating resume:", error);
    return res.status(500).json({ message: error.message });
  }
};

// const updateResume = async (req: Request, res: Response) => {
//   try {
//     const { id, userId, templateId, type, resume } = req.query;

//     if (!userId) {
//       return res.status(400).json({ message: "userId is required" });
//     }

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
//       resumeId
      
//     } = req.body;

//    let existingResume;

// const existingResumeDoc = await ContactResume.find({ userId });

// if (
//   id &&
//   type !== "old" &&
//   templateId &&
//   userId && existingResumeDoc.resumeId === resume
// ) {
//   existingResume = await ContactResume.findOne({ _id: id, userId });
// }
//     else if (id && type !== "old") {
//       existingResume = await ContactResume.findOne({ _id: id, userId });  
//     } 

//     else if (id && type !== "old" ) {
//       existingResume = await ContactResume.findOne({ _id: id, userId });
//     }
    
   
    
//     else {
//       existingResume = await ContactResume.findOne({
//         userId, 
//         resumeStatus: "pending",
//       }).sort({ createdAt: -1 });
//     }

//     if (existingResumeDoc.resumeId !== resume) {
//       const newResume: any = new ContactResume({
//         userId,
//         templateId,
//         resumeId,
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

//       const photoFile = req.file as MulterFile | undefined;
//       if (photoFile) {
//         newResume.photo = photoFile.filename;
//       }

//       const savedResume = await newResume.save();

//       return res.status(201).json({
//         message: "Resume created successfully",
//         resume: savedResume,
//       });
//     }
    
//     const updateData: Record<string, any> = {
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
//       templateId,
//       resumeId
//     };

//     Object.keys(updateData).forEach(
//       (key) => updateData[key] === undefined && delete updateData[key],
//     );

//     const photoFile = req.file as MulterFile | undefined;
//     if (photoFile) {
//       updateData.photo = photoFile.filename;
//     }

//     Object.assign(existingResume, updateData);

//     const updatedResume = await existingResume.save();

//     return res.status(200).json({
//       message: "Resume updated successfully",
//       resume: updatedResume,
//     });
//   } catch (error: any) {
//     console.error("Error updating/creating resume:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

export {
  createContactResume,
  updateResume,
  getContactResume,
  getAllContactResume,
  allContactResume,
};
