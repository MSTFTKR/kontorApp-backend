const express=require('express')
const route=express.Router();
const authController=require('../controller/authController')



route.post('/login',authController.login)
route.post('/register',authController.register)


module.exports=route;