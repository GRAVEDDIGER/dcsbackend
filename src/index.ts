/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import express from 'express'
import welcome from './v1/welcome'
import volunteers from './v1/volunteers'
import news from './v1/news'
import about from './v1/about'

import colors from 'colors'
const morgan = require('morgan')
const app: express.Express = express()
const port = process.env.PORT || 3000
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/welcome', welcome)
app.use('/volunteers', volunteers)
app.use('/news', news)
app.use('/about', about)

app.listen(port, () => console.log(colors.bgBlue.white.bold(`Server listening on port ${port}`)))
