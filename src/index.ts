import express from "express";
import colors from 'colors'
const morgan = require('morgan')
// import helmet from "helmet";
const app = express()
const PORT =process.env.PORT || 8080 
app.use(morgan('dev'))
// app.use(helmet)
app.listen(PORT,()=>{console.log(colors.bgBlue.bold.white(`Server conected on port ${PORT}`))})