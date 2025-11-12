import { Router } from "express";
import {createSetting, getSetting} from "../Controller/setting";
const settingRouter = Router();
settingRouter.post("/setting", createSetting);
settingRouter.get("/get-setting", getSetting);


export default settingRouter;