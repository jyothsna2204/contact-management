const mongoose = require('mongoose');
require('dotenv').config();



const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/contacts_backend';
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log(`DB connected`);
  } catch (error) {
    console.error('DB connection error:', error);
    process.exit(1); // Exit process with failure
  }
};



const contactSchema = new mongoose.Schema({
  user_id:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User",
  },
  name:{
    type: String,
    required:[true,"please enter name"]
  },
  phoneno:{
    type:Number,
    required:[true,"please enter phone number"],
    unique:[true,"phone number already exists"]
  }
});
const contactModel = mongoose.model('contacts', contactSchema);



const userSchema = mongoose.Schema({
  userName:{
    type: String,
    required:[true,"please enter user name"]
  },
  email:{
      type: String,
      required:[true,"please enter email"],
      unique:[true,"email already exists"]
  },
  password:{
    type:String,
    required:[true,"please enter password"],
  }
},
{
  timestamps: true,
}
);
const userModel = mongoose.model('users', userSchema);



module.exports = { connectDB, contactModel, userModel};
