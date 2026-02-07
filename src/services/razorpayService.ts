import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createRazorpayOrder = async (amountInRupees: number) => {
  return razorpay.orders.create({
    amount: amountInRupees * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
};
