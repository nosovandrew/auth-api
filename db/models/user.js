import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: [true, "Email already exist"],
        index: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password!"],
        unique: false, 
    },
});

// apply the custom validator plugin to UserSchema
UserSchema.plugin(mongooseUniqueValidator);

export default mongoose.model.Users || mongoose.model("Users", UserSchema);