import mongoose from "mongoose"
const { Schema } = mongoose;

const Users = new Schema({
    id: String,
    name: String,
    firstName: String,
    vanity: String,
    gender: Number,
    type: String,
    profileUrl: String,
    money: Number,
    exp: Number,
    status: String,
    banned: Object,
    data: Object,
    avatar: String
}, {
    timestamp: true
});

export default mongoose.model("users", Users);