import mongoose, { Schema } from 'mongoose';
const CandidateSchema = new Schema({
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
            validator: (skills) => skills.length > 0,
            message: 'At least one skill is required',
        },
    },
    summary: {
        type: String,
        maxlength: [1000, 'Summary is too long'],
    },
}, { timestamps: true });
export default mongoose.model('Candidate', CandidateSchema);
