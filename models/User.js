const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        profileURL:{
            type: String,
            default: ""
        }
    }, { timestamps: true }
)

mongoose.models = {}

module.exports = mongoose.model('User', userSchema)