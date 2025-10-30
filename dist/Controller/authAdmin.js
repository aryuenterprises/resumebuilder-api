import { Admin } from '../models/admin';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateOtp } from '../utils/otp';
const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey'; // Replace with your actual secret in production
// Register a new user
const register = async (req, res) => {
    const { email, password } = req.body;
    const userExists = await Admin.findOne({ email });
    if (userExists)
        return res.status(400).json({ message: 'Email already in use' });
    const hashedPassword = await hashPassword(password);
    const otp = generateOtp();
    const otpExpireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    const user = await Admin.create({
        email,
        password: hashedPassword,
        verifyOtp: otp,
        verifyOtpExpireAt: otpExpireAt,
    });
    // TODO: Send OTP via email (optional)
    res.status(201).json({ message: 'User registered. Verify OTP.' });
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
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
        return res.status(400).json({ message: 'Invalid credentials' });
    // Optional: Generate token
    res.json({ message: 'Login successful', userId: user._id });
};
const googleLogin = async (req, res) => {
    const { email, googleId } = req.body;
    let user = await Admin.findOne({ email });
    if (!user) {
        user = await Admin.create({
            email,
            googleId,
            // isAccountVerified: true,
        });
    }
    if (user.googleId !== googleId) {
        return res.status(400).json({ message: 'Google ID mismatch' });
    }
    res.json({ message: 'Google login successful', userId: user._id });
};
// Initiate password reset (send OTP or token)
const initiatePasswordReset = async (req, res) => {
    const { email } = req.body;
    const user = await Admin.findOne({ email });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    const resetToken = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const resetExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetExpire;
    await user.save();
    // TODO: Send resetToken via email or SMS
    res.json({ message: 'Reset token generated', token: resetToken }); // Remove `token` from response in production
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
