import { Request, Response } from "express";
import { setting } from "../models/setting";
// const createSetting = async (req: Request, res: Response) => {
//   try {
//     const { PublishableKey, SecretKey } = req.body;

//     console.log("Incoming data:", req.body);

//     let settings = await setting.findOne();

//     if (settings) {
//       settings.PublishableKey = PublishableKey;
//       settings.SecretKey = SecretKey;

//       await settings.save();

//       return res.status(200).json({
//         message: "Settings updated successfully",
//         settings,
//       });
//     } else {
//       settings = new setting({
//         PublishableKey,
//         SecretKey,
//       });

//       await settings.save();

//       return res.status(201).json({
//         message: "Settings created successfully",
//         settings,
//       });
//     }
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getSetting = async (req: Request, res: Response) => {
  try {
    const settings = await setting.find();

    res.json(settings);
  } catch (error: any) {
    console.error("Error fetching contact resumes:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const createSetting = async (req: Request, res: Response) => {
  try {
    const { PublishableKey, SecretKey } = req.body;

    const settings = await setting.findOne() ?? new setting();

    settings.PublishableKey = PublishableKey;
    settings.SecretKey = SecretKey;

    await settings.save();

    const message = settings._id ? "Settings updated successfully" : "Settings created successfully";

    return res.status(settings._id ? 200 : 201).json({
      message,
      settings,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export { createSetting, getSetting };
