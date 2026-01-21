import { Request, Response } from 'express';
import Template from '../models/Template';

// Create a new template
//  const createTemplate = async (req: Request, res: Response) => {
//   try {
//     const { name, description, designFiles, placeholders } = req.body;

//     const newTemplate = await Template.create({
//       name,
//       description,
//       designFiles,
//       placeholders
//     });

//     res.status(201).json(newTemplate);
//   } catch (error: any) {
//     console.error('Create Template Error:', error.message);
//     res.status(500).json({ message: 'Server Error' });
//   }
// };
const createTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, placeholders } = req.body;

    // Multer adds uploaded files to req.files
    // req.files can be undefined or array depending on usage
    const files = req.files as Express.Multer.File[] | undefined;

    const designFiles = files ? files.map(file => file.path) : [];

    const newTemplate = await Template.create({
      name,
      description,
      designFiles,
      placeholders: placeholders ? JSON.parse(placeholders) : []
    });

    res.status(201).json(newTemplate);
  } catch (error: any) {
    console.error('Create Template Error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all templates
 const getTemplates = async (_req: Request, res: Response) => {
  try {
    const templates = await Template.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch templates' });
  }
};

// Get single template by ID
 const getTemplateById = async (req: Request, res: Response) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ message: 'Template not found' });

    res.status(200).json(template);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch template' });
  }
};

// Update a template
const updateTemplate = async (req: Request, res: Response) => {
  try {
    const { name, description, placeholders } = req.body;

    const files = req.files as Express.Multer.File[] | undefined;
    const newFiles = files ? files.map(file => file.path) : [];

    // Find the existing template
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Optional: combine new files with old ones, or replace entirely
    const updatedDesignFiles = [...template.designFiles, ...newFiles];

    // Update fields
    template.name = name ?? template.name;
    template.description = description ?? template.description;
    template.designFiles = updatedDesignFiles;
    template.placeholders = placeholders ? JSON.parse(placeholders) : template.placeholders;

    const updated = await template.save();

    res.status(200).json(updated);
  } catch (error: any) {
    console.error('Update Template Error:', error.message);
    res.status(500).json({ message: 'Failed to update template' });
  }
};

// Delete a template
 const deleteTemplate = async (req: Request, res: Response) => {
  try {
    const deleted = await Template.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Template not found' });

    res.status(200).json({ message: 'Template deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete template' });
  }
};
export {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
};  