const {Schema, default: mongoose}=require('mongoose');
const UserSchema=new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    dateOfBirth: { type: Date, required: true },
    country: { type: String, required: true }
});
const User=mongoose.model('User', UserSchema);
module.exports=User;