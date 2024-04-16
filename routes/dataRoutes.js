const express=require('express')
const route=express.Router();
const dataControllers=require('../controller/dataControllers')
const authMiddleware=require('../middlewares/authMiddleware')


route.post('/create',authMiddleware,dataControllers.createData)
route.put('/update',authMiddleware,dataControllers.updateData)
route.delete('/delete',authMiddleware,dataControllers.deleteData)

module.exports=route;