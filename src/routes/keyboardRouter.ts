import { Router } from "express";
import { createKeyboard, getKeyboard, editKeyboard, deleteKeyboard } from "../Controller/keyboardResume";

const keyboardRouter = Router();
keyboardRouter.post("/create", createKeyboard);
keyboardRouter.get("/keyboard", getKeyboard);
keyboardRouter.put("/edit/:id", editKeyboard);
keyboardRouter.delete("/delete/:id", deleteKeyboard);
export default keyboardRouter;