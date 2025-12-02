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
  res: Response
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
  const { resumeId } = req.query;

  try {
    if (resumeId) {
      const resume = await ContactResume.findById(resumeId);

      if (!resume) {
        return res.status(404).json({ message: "Resume not found" });
      }

      return res.json(resume);
    }

    const resumes = await ContactResume.find({
      userId: id,
      resumeStatus: "pending",
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

const updateResume = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

  
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
      templateId,
    } = req.body;

    let existingResume;

   
    if (id) {
      existingResume = await ContactResume.findOne({ _id: id, userId });
    } else {
     
      existingResume = await ContactResume.findOne({
        userId,
        resumeStatus: "pending",
      }).sort({ createdAt: -1 });
    }

 
    if (!existingResume) {
      const newResume: any = new ContactResume({
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
        templateId,
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
      (key) => updateData[key] === undefined && delete updateData[key]
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




export {
  createContactResume,
  updateResume,
  getContactResume,
  getAllContactResume,
  allContactResume,
};
