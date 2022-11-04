const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema(
    {
        chatID: String,
        messages: [{
            senderID: mongoose.Types.ObjectId,
            message: String,
            sentAt: { type: Date, default: () => Date.now() }
        }]
    }, { timestamps: true }
)

mongoose.models = {}

module.exports = mongoose.model('Chat', chatSchema)