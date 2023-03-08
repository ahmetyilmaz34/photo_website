import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Photo from "../models/photoModel.js";

const createUser = async (req, res) => {
    try {

        const user = await User.create(req.body);
        res.status(201).json({user: user._id});
    } catch (error) {

        let errors2 = {}


        if(error.code === 11000){
            errors2.email= "The email is already in registered";
        }

        if (error.name === "ValidationError") {
            Object.keys(error.errors).forEach((key) => {
                errors2[key]= error.errors[key].message;
            });
        }

    
        res.status(400).json(errors2);
    }
};
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body; // ! body den kullanıcı adı ve şifreyi aldık.
        // console.log("req body", req.body);
        const user = await User.findOne({ username });
        let same = false;
        if (user) {
            same = await bcrypt.compare(password, user.password); //! true ya da false değer dönecek
            // console.log("same", same);
        } else {
            return res.status(401).json({
                succeded: false,
                error: "There is no such user",
            });
        }
        if (same) {
            // res.status(200).send("You are logged in")
            const token = createToken(user._id);
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,

            });
            res.redirect("/users/dashboard");
        } else {
            res.status(401).json({
                succeded: false,
                error: "Passwords are not matched"
            });
        }
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error,
        });
    }
};


const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
}
const getDashboardPage = async (req, res) => {
    const photos = await Photo.find({user:res.locals.user._id});
    res.render("dashboard", {
        link: 'dashboard',
        photos,
    });
}



export { createUser, loginUser, getDashboardPage };