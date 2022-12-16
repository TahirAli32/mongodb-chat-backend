const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema(
    {
        userChat: mongoose.Types.ObjectId,
        // friendsID: {
        //     type: Array,
        //     default: [],
        // },
        friends:[{
            friendID: { type: mongoose.Types.ObjectId, ref: 'User' },
            lastUpdated: { type: Date, default: () => Date.now() }
        }]
    }, { timestamps: true }
)

mongoose.models = {}

module.exports = mongoose.model('Conversation', conversationSchema)