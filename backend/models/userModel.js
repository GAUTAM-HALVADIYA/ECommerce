import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // cartData is stored as an object (initially empty)
    // By default, Mongoose removes empty objects before saving
    // minimize: false ensures that even an empty object {} is saved in the database
    // This is important so cartData always exists for future cart updates
    cartData: { type: Object, default: {} },

}, {
    // Prevent Mongoose from deleting empty objects like cartData
    minimize: false
});


// to avoid multiple time create this user model we add 'mongoose.models.user' as oring
const userModel = mongoose.models.user || mongoose.model('user', userSchema);


export default userModel