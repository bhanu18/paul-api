import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'Student',
        enum: ['Student', 'Instructor'],
    },
    password: {
        type: String,
    },
    token: {
        type: String
    },
    image:{
        data: Buffer,
        contentType: String
    },
    createAt: {
        type: String,
        default: Date.now()
    }
})

const UserModel = mongoose.model('User', userSchema);

export default UserModel;