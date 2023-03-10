const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required:true, trim: true },
  email: { type: String, required:true, unique: true  },
  password: { type: String, required:true },
  tokens: [{ type: Object }],
  role: {type:String, required:true, default: "normal"}
});

//Check password
userSchema.methods.comparePassword = async function (password) {


  if (!password) throw new Error('Password is missing, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};

//Check email
userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error('Invalid Email');
  try {
    const user = await this.findOne( {email } );
    if (user) return false;

    return true;
  } catch (error) {
    console.log('error inside isThisEmailInUse method', error.message);
    return false;
  }
};

//Action during update
userSchema.pre('findOneAndUpdate', async function (next) {
  const userToUpdate = await this.model.findOne(this.getQuery())
  if (this._update.password != undefined)
  {
    if (userToUpdate.password !== this._update.password) {
      this._update.password = await bcrypt.hash(this._update.password, 10)
    }
  }
})

//Action during save
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err); }
    user.password = hash;
    next();
  })
});

module.exports = mongoose.model("User",userSchema);