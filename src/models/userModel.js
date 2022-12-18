const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required:true, trim: true },
  email: { type: String, required:true, unique: true  },
  password: { type: String, required:true },
  tokens: [{ type: Object }],
  role: {type:String, required:true, default: "normal"}
});



userSchema.methods.comparePassword = async function (password) {


  if (!password) throw new Error('Password is missing, can not compare!');

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log('Error while comparing password!', error.message);
  }
};

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


userSchema.pre('findOneAndUpdate', async function (next) {
  console.log('update')
  const userToUpdate = await this.model.findOne(this.getQuery())
  if (this._update.password != undefined)
  {
    if (userToUpdate.password !== this._update.password) {
      this._update.password = await bcrypt.hash(this._update.password, 10)
    }
  }
})

userSchema.pre('save', function (next) {
  console.log('save')
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err); }
    user.password = hash;
    next();
  })
});

// userSchema.statics.validateInput = async function (user){
//     const schema = Joi.object({ 
//         pseudo: Joi.string()
//                    .min(3)
//                    .max(30)
//                    .required(),                   
//         email: Joi.string()
//                   .email()
//                   .min(5)
//                   .max(255)
//                   .required(),

//         password: new PasswordComplexity({
//           min: 6,
//           max: 25,
//           lowerCase: 1,
//           upperCase: 1,
//           numeric: 1,
//           symbol: 1,
//           requirementCount: 4
//         }),

//         role: Joi.string()
//                  .valid('normal')
//                  .valid('employee')
//                  .valid('admin')
//                  .optional()
//     });
//     const test =  schema.validate(user);
// }

module.exports = mongoose.model("User",userSchema);