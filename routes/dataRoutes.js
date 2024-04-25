const express=require('express')
const route=express.Router();
const dataControllers=require('../controller/dataControllers')
const authMiddleware=require('../middlewares/authMiddleware')


route.get('/listYear/:year',dataControllers.listYear)
route.get('/rangeList',dataControllers.rangeList)
route.post('/create',authMiddleware,dataControllers.createData)
route.put('/update',authMiddleware,dataControllers.updateData)
route.delete('/delete',authMiddleware,dataControllers.deleteData)

module.exports=route;