const { string, binary } = require("joi");
const mongoose = require("mongoose");
const trainstationSchema = new mongoose.Schema({
    name: { type: String, required:true, trim: true, unique : true },
    open_hour: { type: String, required:true },
    close_hour: { type: String, required:true},
    image:  {type: String,required: false,}
});

//Check trainstation name
trainstationSchema.statics.isThisNameInUse = async function (name) {
    if (!name) throw new Error('Invalid name');
    try {
        const NameTrainstation = await this.findOne({name});
        if (NameTrainstation) return false;

        return true;
    } catch (error) {
        console.log('Error inside isThisNameInUse method', error.message);
        return false;
    }
};

module.exports = mongoose.model("Trainstation",trainstationSchema);