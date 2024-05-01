const express = require('express')
const route=express.Router();
const userControllers=require('../controller/userControllers')
const authMiddleware=require('../middlewares/authMiddleware')

route.get('/listele',authMiddleware, userControllers.listAll);
route.post('/create',authMiddleware, userControllers.createUser)
route.post('/create',authMiddleware, userControllers.createUser)
route.put('/update',authMiddleware, userControllers.updateUser)
route.delete('/delete',authMiddleware, userControllers.deleteUser)

module.exports=route;