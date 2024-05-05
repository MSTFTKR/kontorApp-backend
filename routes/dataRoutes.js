const express=require('express')
const route=express.Router();
const dataControllers=require('../controller/dataControllers')
const authMiddleware=require('../middlewares/authMiddleware')
const adminAuthMiddleware=require('../middlewares/adminAuthMiddleware')
const authenticateToken=require('../middlewares/listMiddleware')


route.get('/listYear/:year',authenticateToken,dataControllers.listYear)
route.get('/rangeList',authenticateToken,dataControllers.rangeList)
route.post('/create',authMiddleware,dataControllers.createData)
route.post('/adminCreate',adminAuthMiddleware,dataControllers.adminCreateData)
route.put('/update',authMiddleware,dataControllers.updateData)
route.delete('/delete',authMiddleware,dataControllers.deleteData)

module.exports=route;