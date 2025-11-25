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

// const createSetting = async (req: Request, res: Response) => {
//   try {
//     const { PublishableKey, SecretKey, email,currenyType, host,port,username,password,fromName  } = req.body;
//     const logoImage = req.file;

//     const settings = await setting.findOne() ?? new setting();

//     settings.PublishableKey = PublishableKey;
//     settings.SecretKey = SecretKey;
//     settings.logoImage = logo?.filename;
//     settings.email = email;
//     settings.currenyType = currenyType;
//     settings.host = host;
//     settings.port = port;
//     settings.username = username;
//     settings.password = password;
//     settings.fromName = fromName;
//     await settings.save();

//     const message = settings._id ? "Settings updated successfully" : "Settings created successfully";

//     return res.status(settings._id ? 200 : 201).json({
//       message,
//       settings,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createSetting = async (req: Request, res: Response) => {
  try {
    const {
      PublishableKey,
      SecretKey,
      email,
      currenyType,
      host,
      port,
      username,
      password,
      fromName
    } = req.body;

    const logoFile = req.file;
    console.log("Incoming file:", logoFile);

    let settings = await setting.findOne();
    const isNew = !settings;

    if (!settings) settings = new setting();

    if (PublishableKey) settings.PublishableKey = PublishableKey;
    if (SecretKey) settings.SecretKey = SecretKey;

    if (logoFile) {
      settings.logoImage = logoFile.filename;
    }

    if (email) settings.email = email;
    if (currenyType) settings.currenyType = currenyType;
    if (host) settings.host = host;
    if (port) settings.port = port;
    if (username) settings.username = username;
    if (password) settings.password = password;
    if (fromName) settings.fromName = fromName;

    await settings.save();

    return res.status(isNew ? 201 : 200).json({
      message: isNew ? "Settings created successfully" : "Settings updated successfully",
      settings,
    });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};





export { createSetting, getSetting };
