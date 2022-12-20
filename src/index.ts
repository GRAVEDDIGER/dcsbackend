/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
// import helmet from "helmet";
const app = express()
const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(morgan('dev'))
// app.use(helmet)
app.listen(PORT, () => { console.log(colors.bgBlue.bold.white(`Server conected on port ${PORT}`)) })
