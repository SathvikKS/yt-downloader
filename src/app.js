const express = require('express')
const yt = require('./router/music')

const port = process.env.PORT || 3000
const app = express()

app.use(yt)
app.use(express.json())

app.listen(port, () => {
    console.log('App running on port: '+port)
})