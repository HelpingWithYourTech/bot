const mongoose = require("mongoose");

module.exports = mongoose.model("Client", new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    job: { type: String },
    notes: { type: Array, default: [] }
}));