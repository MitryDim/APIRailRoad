const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId , required:true },
    trainID: { type: mongoose.Schema.Types.ObjectId , required:true },
    book_on: { type: Date, required:true, default: Date.now }
});

module.exports = mongoose.model("Tickets",ticketSchema);