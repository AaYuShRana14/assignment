const {z}=require('zod');
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema=z.object({
    username: z.string().min(3).max(20),
    email: z.string().email(),
    password: z.string().min(8),
    fullName: z.string().min(3).max(15),
    gender:z.enum(["Male", "Female", 'Other']),
    dateOfBirth: z.date(),
    country:z.string().min(3).max(15)
})
const LoginSchema=z.object({
    email: z.string().email(),
    password: z.string().min(8)
});
const Register=async(req,res)=>{
    let{username,email,password,fullName,gender,dateOfBirth,country}=req.body;
    dateOfBirth=new Date(dateOfBirth);
    const data= UserSchema.safeParse({username,email,password,fullName,gender,dateOfBirth,country});
    if(data.success){
        try{
            const user=await User.findOne({email});
            if(user){
                return res.status(400).json({message:"User already exists"});
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            const newUser=new User({
                username,
                email,
                password:hashedPassword,
                fullName,
                gender,
                dateOfBirth,
                country
            });
            await newUser.save();
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});
            res.json({msg:'User created successfully',token});
        }
        catch(e){
            console.log(e)
            res.status(500).send("Error in saving");
        }
    }
    else{
        console.log(data.error);
        res.status(400).json({msg:'Invalid data'});
    }
}
const Login=async(req,res)=>{
    const{email,password}=req.body;
    const data= LoginSchema.safeParse({email,password});
    if(data.success){
        try{
            const user=await User.findOne({email});
            if(!user){
                return res.status(400).json({message:"User does not exist"});
            }
            const isMatch = await bcrypt.compare(password,user.password);
            if(!isMatch){
                return res.status(400).json({message:"Invalid credentials"});
            }
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});
            res.json({msg:'Login successful',token});
        }
        catch(e){
            console.log(e)
            res.status(500).send("Error in login");
        }
    }
    else{
        console.log(data.error);
        res.status(400).json({msg:'Invalid data'});
    }
}
const getUser=async(req,res)=>{
    try{
        const useremail=req.user.email;
        const user=await User.findOne({email:useremail});
        res.json(user);
    }
    catch(e){
        console.log(e);
        res.status(500).send("Error in getting user");
    }
}

module.exports={Register,Login,getUser};