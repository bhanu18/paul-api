import UserModel from "../models/User.js";
import bcrypt from 'bcryptjs';
import passport from "passport";
import Role from "../models/Role.js";
import jwt from 'jsonwebtoken';

const secretKey = 'secret_cat';

export const login = async (req, res, next) => {

    try {
        // create user login with password verification
        const user = {
            username: req.body.email,
            password: res.body.password,
        };

        const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });

        res.header('Authorization', token).send(user);
    } catch (error) {
        console.log(err);
        res.status(500);
    }

}

export const createUser = async (req, res) => {
    const { name, email, role, password } = req.body

    UserModel.findOne({ email: email }).then(user => {
        if (user) {
            res.send("User exist");
        } else {
            const newUser = new UserModel({
                name: name,
                email: email,
                role: role,
                password: password,
            });

            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;

                    newUser.save().then(user => {
                        res.send("user created");
                    })
                        .catch(err => console.log(err));
                }))
        }
    })
}

export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.user._id }).lean();
        res.send(req.user);
    } catch (error) {
        res.status(500);
        console.log(error);
    }
}

export const logUserOut = (req, res) => {
    req.logout(function (err) {
        if (err) { return err; }
        req.send('success_msg', 'Logged out succesfully')
    });
}

export const role = async (req, res) => {

    try {
        const role = await Role.find().lean();
        res.send(role);
    } catch (error) {
        console.log(err);
        res.status(500);
    }
}

export const addrole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.send(role);
    } catch (error) {
        console.log(err);
        res.status(500);
    }
}

export const refreshToken = async () => {

    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
        const decoded = jwt.verify(refreshToken, secretKey);
        const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });

        res
            .header('Authorization', accessToken)
            .send(decoded.user);
    } catch (error) {
        return res.status(400).send('Invalid refresh token.');
    }
}


const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).send('Invalid Token.');
    }
};