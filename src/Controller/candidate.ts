import { Request, Response } from 'express';
import Candidate from '../models/Candidate';
import {ContactResume} from '../models/ContactResume';
import mongoose from 'mongoose';

 const createCandidate = async (req: Request, res: Response) => {
  try {
    const candidate = new Candidate(req.body);
    const saved = await candidate.save();
    res.status(201).json(saved);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

 const getAllCandidates = async (_req: Request, res: Response) => {
  try {
    const candidates = await Candidate.find().populate('user');
    res.json(candidates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

 const getCandidateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const candidate = await Candidate.findById(id).populate('user');
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

 const updateCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCandidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json(updatedCandidate);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

 const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }

    const deleted = await Candidate.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({ message: 'Candidate deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};




export {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};  