import {Schema, model, Document} from 'mongoose';
export interface IPlanSubscription extends Document {
    desiredJobTitle: string;
    price: number;
    status: string;
}

const PlanSubscriptionSchema = new Schema<IPlanSubscription>({
    desiredJobTitle: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
},{ timestamps: true });

export const PlanSubscription = model<IPlanSubscription>('PlanSubscription', PlanSubscriptionSchema);

