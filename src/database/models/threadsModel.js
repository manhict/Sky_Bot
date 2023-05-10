import mongoose from "mongoose"
const { Schema } = mongoose;

const Threads = new Schema({
    id: String,
    name: String,
    emoji: String,
    prefix: String,
    language: String,
    adminIDs: Array,
    members: Object,
    approvalMode: String,
    status: String,
    banned: Object,
    data: Object,
    avatar: String,
    messageCount: Number,
    numberMember: Number,
    members: Object
}, {
    timestamp: true
});

export default mongoose.model("threads", Threads);