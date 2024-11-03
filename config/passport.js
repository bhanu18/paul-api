import UserModel from '../models/Users.js';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';


const passportConfig = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Password incorrect' });
            }
        });
    })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        UserModel.findById(id, (err, user) => done(err, user))
    })
}

export default passportConfig;