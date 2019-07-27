"use strict";

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ModelSchema = new Schema(
    {
        firebaseId: {
            type: String,
            require: true,
            trim: true
        },
        accountId: {
            type: Schema.Types.ObjectId,
            ref: "Account"
        },
        fcmRegistrationToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", ModelSchema);
