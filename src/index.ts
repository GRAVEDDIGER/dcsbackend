/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import express from 'express'
import welcome from './v1/welcome'
import colors from 'colors'
const morgan = require('morgan')
const app: express.Express = express()
const port = process.env.PORT || 3000
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', welcome)
app.listen(port, () => console.log(colors.bgBlue.white.bold(`Server listening on port ${port}`)))
