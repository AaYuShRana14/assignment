const express=require('express');
const app=express();
const connectDB=require('./config/db');
const userRoutes=require('./routes/userRouter');
require("dotenv").config();
const cors=require('cors'); 
app.use(cors());
app.use(express.json());
connectDB();
app.use('/api/users', userRoutes);
app.listen(process.env.PORT,()=>{
    console.log(`Running on Port ${process.env.PORT}`)
});