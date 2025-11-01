import { Router } from "express";
import {createTone,
    getTone,
    editTone,
    deleteTone} from "../Controller/toneResume";

const toneRouter = Router();
toneRouter.post("/create", createTone);
toneRouter.get("/tone", getTone);
toneRouter.put("/edit/:id", editTone);
toneRouter.delete("/delete/:id", deleteTone);
export default toneRouter;