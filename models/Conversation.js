const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema(
    {
        userChat: mongoose.Types.ObjectId,
        friendsID: {
            type: Array,
            default: [],
        }
    }, { timestamps: true }
)

mongoose.models = {}

module.exports = mongoose.model('Conversation', conversationSchema)