import mongoose from "mongoose";

const RoleSchema = mongoose.Schema({
    role_name: {
        type:String
    }
});

const Role = mongoose.model('Role', RoleSchema);

export default Role;