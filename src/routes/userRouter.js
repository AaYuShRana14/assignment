const {Register,Login,getUser}=require('../controller/userController');
const isLoggedin=require('../Middleware/isLoggedin');
const express=require('express');
const router = express.Router();
router.post('/register',Register);
router.post('/login',Login);
router.get('/me',isLoggedin,getUser);
module.exports=router;  