const mongoose = require("mongoose");
const trainSchema = new mongoose.Schema({
    name: { type: String, required:true, trim: true, unique : true },
    start_station: { type: String, required:true },
    end_station: { type: String, required:true },
    time_of_departure: { type: String, required:true },
});

trainSchema.statics.isThisNameInUse = async function (name) {
    if (!name) throw new Error('Invalid name');
    try {
        const nameTrain = await this.findOne({name});
        if (nameTrain) return false;

        return true;
    } catch (error) {
        console.log('Error inside isThisNameInUse method', error.message);
        return false;
    }
};

module.exports = mongoose.model("Train",trainSchema);