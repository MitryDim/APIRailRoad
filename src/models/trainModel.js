const mongoose = require("mongoose");
const trainSchema = new mongoose.Schema({
    name: { type: String, required:true, trim: true, unique : true },
    start_station: { type: String, required:true },
    end_station: { type: String, required:true },
    time_of_departure: { type: Date, required:true },
});

trainSchema.statics.isThisNameInUse = async function (name) {
    if (!name) throw new Error('Invalid name');
    try {
        const user = await this.findOne({name});
        if (name) return false;

        return true;
    } catch (error) {
        console.log('Error inside isThisNameInUse method', error.message);
        return false;
    }
};

module.exports = mongoose.model("Train",trainSchema);