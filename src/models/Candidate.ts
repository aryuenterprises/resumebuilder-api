import mongoose, { Schema, Document } from 'mongoose';

interface Experience {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

interface Education {
  institution: string;
  degree: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface ICandidate extends Document {
  user: mongoose.Types.ObjectId;
  contactInfo: {
    phone?: string;
    address?: string;
    email?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CandidateSchema:Schema<ICandidate> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },

    contactInfo: {
      phone: {
        type: String,
        match: [/^\+?[0-9]{7,15}$/, 'Invalid phone number'],
      },
      address: {
        type: String,
        maxlength: [200, 'Address too long'],
      },
      email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
      },
    },

    experience: [
      {
        company: {
          type: String,
          required: [true, 'Company name is required'],
        },
        role: {
          type: String,
          required: [true, 'Role is required'],
        },
        startDate: {
          type: Date,
          required: [true, 'Start date is required'],
        },
        endDate: Date,
        description: {
          type: String,
          maxlength: 1000,
        },
      },
    ],

    education: [
      {
        institution: {
          type: String,
          required: [true, 'Institution name is required'],
        },
        degree: {
          type: String,
          required: [true, 'Degree is required'],
        },
        startDate: {
          type: Date,
          required: [true, 'Start date is required'],
        },
        endDate: Date,
        description: {
          type: String,
          maxlength: 1000,
        },
      },
    ],

    skills: {
      type: [String],
      validate: {
        validator: (skills: string[]) => skills.length > 0,
        message: 'At least one skill is required',
      },
    },

    summary: {
      type: String,
      maxlength: [1000, 'Summary is too long'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);
