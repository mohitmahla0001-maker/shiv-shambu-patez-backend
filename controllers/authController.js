const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mailer");

const JWT_SECRET = process.env.JWT_SECRET || "shivshambupatez_secret_key";

const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        if (!name || !phone || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or phone" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, phone, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, phone: user.phone, email: user.email, address: user.address },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: "Please provide email/phone and password" });
        }

        const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

        res.status(200).json({
            token,
            user: { id: user._id, name: user.name, phone: user.phone, email: user.email, address: user.address },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        const text = `Hi ${user.name},\n\nYour password has been reset.\n\nYour new password is: ${newPassword}\n\nPlease login with this password.\n\n- Shiv Shambu PATEZ`;
        await sendEmail(user.email, "Your New Password - Shiv Shambu PATEZ", text);

        res.status(200).json({ message: "New password sent to your email" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword };