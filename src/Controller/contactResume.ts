import { Request, Response } from "express";
import { ContactResume } from "../models/ContactResume";
import mongoose from "mongoose";

// const getContactResume = async (req: Request, res: Response) => {
//   const { id } = req.params;
//   try {
//     const resumes = await ContactResume.find({ userId: id });
//     res.json(resumes);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getContactResume = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // if (!id) {
    //   return res.status(400).json({ message: "User ID is required" });
    // }

    const resumes = await ContactResume.find({
      userId: id,
      resumeStatus: "pending",
    }).sort({ createdAt: -1 });

    // if (!resumes || resumes.length === 0) {
    //   return res.status(404).json({ message: "No pending resumes found" });
    // }

    res.json(resumes);
  } catch (error: any) {
    console.error("Error fetching contact resumes:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const allContactResume = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // if (!id) {
    //   return res.status(400).json({ message: "User ID is required" });
    // }

    const resumes = await ContactResume.find({
      userId: id,
      // resumeStatus: "pending",
    }).sort({ createdAt: -1 });

    // if (!resumes || resumes.length === 0) {
    //   return res.status(404).json({ message: "No pending resumes found" });
    // }

    res.json(resumes);
  } catch (error: any) {
    console.error("Error fetching contact resumes:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
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


const createContactResume = async (req: Request, res: Response): Promise<Response> => {
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

// const updateResume = async (req: Request, res: Response) => {
//   try {
//     const { id, userId } = req.query;
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
//     } = req.body;

//     // Step 1: Find existing resume
//     let existingResume;

//     if (id) {
//       existingResume = await ContactResume.findOne({ _id: id, userId });
//     } else {
//       existingResume = await ContactResume.findOne({ userId });
//     }

//     // Step 2: If not found, create new one
//     if (!existingResume) {
//       const newResume = new ContactResume({
//         userId,
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

//       const saved = await newResume.save();
//       return res.status(201).json({
//         message: "Resume created successfully",
//         resume: saved,
//       });
//     }

//     const updateData: Record<string, any> = {};

//     const allFields = {
//       firstName,
//       lastName,
//       email,
//       jobTitle,
//       phone,
//       country,
//       city,
//       address,
//       postCode,
//       linkedIn,
//       portfolio,
//       keywords,
//       tones,
//     };

//     for (const key in allFields) {
//       if (Object.prototype.hasOwnProperty.call(req.body, key)) {
//         // Directly assign the value — including empty strings
//         updateData[key] = allFields[key];
//       }
//     }

//     // Step 4: Apply updates
//     Object.assign(existingResume, updateData);

//     const updated = await existingResume.save();

//     res.status(200).json({
//       message: "Resume updated successfully",
//       resume: updated,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };
const updateResume = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.query;

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
      templateId
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId are required" });
    }

    let existingResume;

    if (id) {
      existingResume = await ContactResume.findOne({ _id: id, userId});
    } else {
      existingResume = await ContactResume.findOne({ userId });
    }

    // if (!existingResume || existingResume.resumeStatus === "success") {
    if (!id && !existingResume) {
      const newResume = new ContactResume({
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
        templateId
      });

      const saved = await newResume.save();
      return res.status(201).json({
        message: "Resume created successfully",
        resume: saved,
      });
    }

    const updateData: Record<string, any> = {};

    const allFields = {
      firstName,
      lastName,
      email,
      jobTitle,
      phone,
      country,
      city,
      address,
      postCode,
      linkedIn,
      portfolio,
      keywords,
      tones,
    };

    for (const key in allFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updateData[key] = allFields[key];
      }
    }
    const photoFile = req.files?.find((file) => file.fieldname === "photo");
    if (photoFile) {
      updateData.photo = photoFile.filename;
    }
    console.log("Update Data:", photoFile);

    Object.assign(existingResume, updateData);
    const updated = await existingResume.save();

    res.status(200).json({
      message: "Resume updated successfully",
      resume: updated,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



// const updateResume = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { firstName, lastName, email, jobTitle, keywords, tones, phone, country, city, address, postCode, linkedIn, portfolio } = req.body;
//     const resume = await ContactResume.findById(id);
//     if (!resume) {
//       return res.status(404).json({ message: "Resume not found" });
//     }
//     if (firstName) resume.firstName = firstName;
//     if (lastName) resume.lastName = lastName;
//     if (email) resume.email = email;
//     if (phone) resume.phone = phone;
//     if (jobTitle) resume.jobTitle = jobTitle;
//     if (country) resume.country = country;
//     if (city) resume.city = city;
//     if (address) resume.address = address;
//     if (postCode) resume.postCode = postCode;
//     if (linkedIn) resume.linkedIn = linkedIn;
//     if (portfolio) resume.portfolio = portfolio;
//     if (keywords && Array.isArray(keywords)) {
//       resume.keywords = keywords;
//     }
//     if (tones && Array.isArray(tones)) {
//       resume.tones = tones;
//     }
//     await resume.save();
//     res.status(200).json({
//       message: "Resume updated successfully",
//       resume
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

export {
  createContactResume,
  updateResume,
  getContactResume,
  getAllContactResume,
  allContactResume
};
