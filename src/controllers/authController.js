const User = require('../models/user');   // 👈 changed name
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existinguser = await User.findOne({ email });
        if (existinguser)
            return res.status(400).json({ message: "User already exists" });

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedpassword,
            role
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 👇 Now no conflict
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid email" });

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch)
            return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }   // 👈 change 1hr → 1h
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,     // true in production (HTTPS)
            sameSite: "Lax",
            maxAge: 60 * 60 * 1000
        });

        res.json({
            message: "Login successful",
            token
        });


    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


