const express = require('express')
const routes=express.Router();
const userRouters= require('./userRoutes')
const dataRouters=require('./dataRoutes')

routes.use('/user',userRouters)
routes.use('/data',dataRouters)
routes.get('/', (req, res) => {
    res.send('Ana sayfa');
});

module.exports=routes;