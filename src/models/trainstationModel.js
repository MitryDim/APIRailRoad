const mongoose = require("mongoose");
const trainstationSchema = new mongoose.Schema({
    name: { type: String, required:true, trim: true },
    open_hour: { type: Date, required:true, unique: true  },
    close_hour: { type: Date, required:true, unique: true  },
    images: [{ type: Object }],
});

trainstationSchema.statics.isThisNameInUse = async function (name) {
    if (!name) throw new Error('Invalid name');
    try {
        const user = await this.findOne( {name} );
        if (name) return false;

        return true;
    } catch (error) {
        console.log('Error inside isThisNameInUse method', error.message);
        return false;
    }
};

module.exports = mongoose.model("Trainstation",trainstationSchema);