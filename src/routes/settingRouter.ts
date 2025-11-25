import { Router } from "express";
import {createSetting, getSetting} from "../Controller/setting";
import upload from "../middlewares/upload.js";
const settingRouter = Router();
settingRouter.post("/setting",upload.single("logoImage"), createSetting);
settingRouter.get("/get-setting", getSetting);


export default settingRouter;