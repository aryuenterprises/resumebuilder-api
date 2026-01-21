import { Router } from 'express';
import upload from '../middlewares/upload.js';
import { createTemplate, deleteTemplate, getTemplateById, getTemplates, updateTemplate } from '../Controller/templates';


const templateRoutes = Router();

// For uploading multiple files with field name 'designFiles'
templateRoutes.post('/', upload.array('designFiles', 5), createTemplate);

templateRoutes.get('/', getTemplates);
templateRoutes.get('/:id', getTemplateById);
templateRoutes.put('/:id', updateTemplate);
templateRoutes.delete('/:id', deleteTemplate);

export default templateRoutes;
