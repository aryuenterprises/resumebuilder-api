import { Router } from 'express';
import { createCandidate, deleteCandidate, getAllCandidates, getCandidateById, updateCandidate } from '../Controller/candidate';


const candidateRouter = Router();

candidateRouter.post('/', createCandidate);            // CREATE
candidateRouter.get('/', getAllCandidates);            // READ ALL
candidateRouter.get('/:id', getCandidateById);         // READ ONE
candidateRouter.put('/:id', updateCandidate);          // UPDATE
candidateRouter.delete('/:id', deleteCandidate);       // DELETE

export default candidateRouter;
