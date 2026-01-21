import { DesiredJobTitle } from '../models/desiredJobTitle';
import { PlanSubscription } from '../models/planSubscription';
const createDesiredJobTitle = async (req, res) => {
    try {
        const { name, keywords, tones, status } = req.body;
        const desiredJobTitle = new DesiredJobTitle({ name, keywords, tones, status });
        await desiredJobTitle.save();
        res.status(201).json(desiredJobTitle);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const getDesiredJobTitle = async (req, res) => {
    try {
        // 1️⃣ Fetch all desired job titles
        const desiredJobTitles = await DesiredJobTitle.find();
        // 2️⃣ For each job title, fetch plan price
        const results = await Promise.all(desiredJobTitles.map(async (job) => {
            const plan = await PlanSubscription.findOne({
                desiredJobTitle: job._id,
            });
            return {
                _id: job._id,
                name: job.name,
                keywords: job.keywords,
                tones: job.tones,
                status: job.status,
                price: plan ? plan.price : null, // ✅ Add price directly into jobTitle
            };
        }));
        // 3️⃣ Send simplified response
        res.json({ data: results });
    }
    catch (error) {
        console.error("Error fetching job titles:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const editDesiredJobTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, keywords, tones, status } = req.body;
        const desiredJobTitle = await DesiredJobTitle.findById(id);
        if (!desiredJobTitle) {
            return res.status(404).json({ error: 'Desired job title not found' });
        }
        desiredJobTitle.name = name;
        desiredJobTitle.keywords = keywords;
        desiredJobTitle.tones = tones;
        desiredJobTitle.status = status;
        await desiredJobTitle.save();
        res.json(desiredJobTitle);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteDesiredJobTitle = async (req, res) => {
    try {
        const { id } = req.params;
        const desiredJobTitle = await DesiredJobTitle.findByIdAndDelete(id);
        if (!desiredJobTitle) {
            return res.status(404).json({ error: 'Desired job title not found' });
        }
        res.json({ message: 'Desired job title deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
export { createDesiredJobTitle, getDesiredJobTitle, editDesiredJobTitle, deleteDesiredJobTitle };
