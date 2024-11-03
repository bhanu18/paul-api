import UserModel from "../models/Users.js";
import bcrypt from 'bcryptjs';
import passport from "passport";
import Role from "../models/Role.js";

export const findUser = async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.json({"success": false,"msg":" Email or password is incorrect"});
        else {
            req.logIn(user, async (err) => {
                const token = randomSting(16);
                let tokenObj = {
                    token : token
                }
                await UserModel.findByIdAndUpdate({ _id: req.user._id }, tokenObj );
                if (err) throw err;
                res.json({"success": true, "msg":"Successfully Authenticated", "role": req.user.role, "user_id": req.user._id, "user_name": req.user.name, "token": req.user.token });
                console.log(req.user);
            });
        }
    })(req, res, next);
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
        //const user = await UserModel.findById( {_id: req.user._id}).lean();
        res.send(req.user);
    } catch (error) {
        res.status(500);
        console.log(error);
    }
}

export const logUserOut = (req, res) => {
    req.logout(function(err) {
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

function randomSting(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}