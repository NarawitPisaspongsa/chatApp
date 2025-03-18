import { generateJWTToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {

        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required!"});
        }

        if(password.length < 8){
            return res.status(400).json({message: "Password must be at least 8 characters"});
        }

        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({ message: "Email already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        if (newUser) {
            //gen jwt token
            generateJWTToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({message: "Invalid User data"});
        }

    } catch (err) {
        console.log(`Error in signup controller ${err.message}`);        
        res.status(500).json({message: "Internal server error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        
        const pwCorrect = await bcryt.compare(password, user.password);
        if (!pwCorrect) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateJWTToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.fullName,
            profilePic: user.profilePic
        });
    } catch (err) {
        console.log("Error in a login controller: ", err.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully"});
    } catch (err) {
        console.log("Error in a logout controller: ", err.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}