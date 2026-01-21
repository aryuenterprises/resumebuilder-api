import { Admin } from '../models/admin';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateOtp } from '../utils/otp';
import Notification from '../models/notification';
import { generateToken } from '@utils/jwt';
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey';
// Register a new user
const register = async (req, res) => {
    const { email, password } = req.body;
    //  Strong password check using regex
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be 8+  chars: Aa1@' });
    }
    const userExists = await Admin.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await hashPassword(password);
    const otp = generateOtp();
    const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const user = await Admin.create({
        email,
        password: hashedPassword,
        verifyOtp: otp,
        verifyOtpExpireAt: otpExpireAt,
    });
    res.status(201).json({ message: 'User registered.' });
};
// Verify OTP
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await Admin.findOne({ email });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    if (user.verifyOtp !== Number(otp) || user.verifyOtpExpireAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    // user.isAccountVerified = true;
    user.verifyOtp = 0;
    user.verifyOtpExpireAt = new Date();
    await user.save();
    res.json({ message: 'OTP verified. Account activated.' });
};
// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email });
    if (!user || !user.password) {
        return res.status(400).json({ email: 'Email Is Invalid.' });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
        return res.status(400).json({ password: 'Incorrect Password.' });
    const token = generateToken(user.id); //  or user._id.toString()
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: 'Login successful', user: {
            _id: user._id, email: user.email,
        }, token, success: true });
};
//  const googleLogin = async (req: Request, res: Response) => {
//   const { email, googleId } = req.body;
//   let user = await Admin.findOne({ email });
//   if (!user) {
//     user = await Admin.create({
//       email,
//       googleId,
//       // isAccountVerified: true,
//     });
//   }
//   if (user.googleId !== googleId) {
//     return res.status(400).json({ message: 'Google ID mismatch' });
//   }
//   res.json({ message: 'Google login successful', userId: user._id });
// };
// Initiate password reset (send OTP or token)
const googleLogin = async (req, res) => {
    const { email, googleId } = req.body;
    let user = await Admin.findOne({ email });
    if (!user) {
        user = await Admin.create({
            email,
            googleId,
            // isAccountVerified: true, // optional
        });
    }
    if (user.googleId !== googleId) {
        return res.status(400).json({ message: 'Google ID mismatch' });
    }
    const token = generateToken(user.id); // Mongoose automatically gives you the string version of _id
    // Also works, ensure type is ObjectId
    res.json({ data: { message: 'Google login successful', token, userId: user._id }, success: true });
};
const initiatePasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Admin.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Generate a simple reset token
        const resetToken = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        const resetExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetExpire;
        await user.save();
        // Send reset token notification
        const notification = new Notification({
            to: email,
            subject: 'Sending OTP for Reset Password',
            message: `Your OTP for resetting password is: ${resetToken}. It is valid for 10 minutes.`,
            name: 'Admin User',
            template: 'passwordReset'
        });
        await notification.save();
        // Optional: log for testing
        console.log(` sent to ${email}: ${resetToken}`);
        res.status(200).json({
            message: 'Password reset OTP sent',
            ...(process.env.NODE_ENV !== 'production' && { token: resetToken }) // Only expose token in dev
        });
    }
    catch (error) {
        console.error(' Error in initiatePasswordReset:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
// Complete password reset using OTP
const completePasswordReset = async (req, res) => {
    const { email, token, newPassword } = req.body;
    const user = await Admin.findOne({
        email,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: new Date() }
    });
    if (!user)
        return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.json({ message: 'Password has been reset successfully' });
};
// Get user by ID (Protected)
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Admin.findById(userId).select('-password');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get user', error });
    }
};
export { register, verifyOtp, login, initiatePasswordReset, completePasswordReset, getUserById, googleLogin };
