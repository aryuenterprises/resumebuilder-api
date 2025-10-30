import { log } from 'console';
import { User } from '../models/User';
// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};
// Get user by ID
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
};
// Create user
const addUser = async (req, res) => {
    console.log(req.body);
    const { name, email, phone, address } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
        return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, phone, address });
    res.status(201).json(user);
};
// Update user
const editUser = async (req, res) => {
    const { name, email, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, email, phone, address }, { new: true });
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json(user);
};
// Delete user
const deleteUser = async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
};
export { getAllUsers, getUserById, addUser, editUser, deleteUser };
