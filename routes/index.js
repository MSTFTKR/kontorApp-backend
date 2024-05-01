const express = require('express')
const routes=express.Router();
const userRouters= require('./userRoutes')
const dataRouters=require('./dataRoutes')
const authRouters=require('./authRouters')

routes.use('/user',userRouters)
routes.use('/data',dataRouters)
routes.use('/auth',authRouters)
routes.get('/', (req, res) => {
    res.send('Ana sayfa');
});

module.exports=routes;