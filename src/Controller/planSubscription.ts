import {Request, Response} from 'express';
import {PlanSubscription} from '../models/planSubscription';
import mongoose from 'mongoose';

const createPlanSubscription = async (req: Request, res: Response) => {
    try {
        const { price,plan,status,name,description,order } = req.body;
        const planSubscriptionDetails = new PlanSubscription({ plan,price,status,name,description,order });
        await planSubscriptionDetails.save();
        res.status(201).json(planSubscriptionDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// const getPlanSubscription = async (req: Request, res: Response) => {
//     try {
//         const type = req.query.type as string;
        
//         const query = type === 'active' ? { status: '1' } : {};
//         const planSubscriptionDetails = await PlanSubscription.find(query);
        
//         return res.json(planSubscriptionDetails);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
const getPlanSubscription = async (req: Request, res: Response) => {
    try {
        const type = req.query.type as string;

        const query = type === 'active' ? { status: '1' } : {};

        const planSubscriptionDetails = await PlanSubscription.find(query).sort({ order: 1 });

        return res.json(planSubscriptionDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const editPlanSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { plan,price,status,name,description } = req.body;
        const planSubscriptionDetails = await PlanSubscription.findById(id);
        if (!planSubscriptionDetails) {
            return res.status(404).json({ error: 'planSubscriptionDetails not found' });
        }
        planSubscriptionDetails.price = price;
        planSubscriptionDetails.name = name;
        planSubscriptionDetails.plan = plan;
        planSubscriptionDetails.description = description;
        planSubscriptionDetails.status = status;
        await planSubscriptionDetails.save();
        res.json(planSubscriptionDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePlanSubscription = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const PlanSubscriptionDetails = await PlanSubscription.findByIdAndDelete(id);
        if (!PlanSubscriptionDetails) {
            return res.status(404).json({ error: 'PlanSubscriptionDetails not found' });
        }
        res.json({ message: 'PlanSubscriptionDetails deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    createPlanSubscription,
    getPlanSubscription,
    editPlanSubscription,
    deletePlanSubscription,
}