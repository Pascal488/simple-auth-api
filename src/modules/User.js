import mongoose from "mongoose"
const {Schema} = mongoose
import bcrypt from "bcrypt"



const userSchema = new Schema({
        username: {
                type: String,
                required: [true, "Username is required"]
        },
        email: {
                type: String,
                required: [true, "Email is required"],
                unique:true
        },
        password: {
                type: String,
                required: [true, "Password is required"],
        },
        token: {
                type: String,
                default: null
        }
})
userSchema.methods.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User",userSchema)