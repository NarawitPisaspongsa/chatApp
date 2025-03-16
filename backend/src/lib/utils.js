import jwt from "jsonwebtoken"
export const generateJWTToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //ages in milliseconds
        httpOnly: true, // prevent document.cookie
        sameSite: "strict", // prevents CSRF attack
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
};