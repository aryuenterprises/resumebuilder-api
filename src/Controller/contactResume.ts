import {Request, Response} from 'express';
import {ContactResume} from '../models/ContactResume';
import mongoose from 'mongoose';

const getContactResume = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        const resumes = await ContactResume.find({userId: id});
        res.json(resumes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
const getAllContactResume = async (req: Request, res: Response) => {
    try {
        const resumes = await ContactResume.find();
        res.json(resumes);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
const createContactResume = async (req: Request, res: Response) => {
    try {
        const {userId, firstName, lastName, email, jobTitle, keywords, tones, phone, country, city, address, postCode } = req.body;
        const contactResume = new ContactResume({ userId,firstName, lastName, email, jobTitle, keywords, tones, phone, country, city, address, postCode });
        const saved = await contactResume.save();
        res.status(201).json(saved);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

const updateResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, jobTitle, keywords, tones, phone, country, city, address, postCode } = req.body;
    const resume = await ContactResume.findById(id);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    if (firstName) resume.firstName = firstName;
    if (lastName) resume.lastName = lastName;
    if (email) resume.email = email;
    if (phone) resume.phone = phone;
    if (jobTitle) resume.jobTitle = jobTitle;
    if (country) resume.country = country;
    if (city) resume.city = city;
    if (address) resume.address = address;
    if (postCode) resume.postCode = postCode;
    if (keywords && Array.isArray(keywords)) {
      resume.keywords = keywords;
    }
    if (tones && Array.isArray(tones)) {
      resume.tones = tones;
    }
    await resume.save();
    res.status(200).json({
      message: "Resume updated successfully",
      resume
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export {createContactResume, updateResume, getContactResume, getAllContactResume};