const 
  express = require('express'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  path = require('path'),
  { uri } = require('./config')

const 
  PORT = process.env.PORT || 3030,
  app = express()

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
} 

app.use(morgan('dev'))

app.use(allowCrossDomain)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// app.use(express.static(path.resolve(__dirname, '../dist')))
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
// })
app.use('/users', usersRoutes)
app.use(profileRoutes)

app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    message: error.message
  })
})


async function start() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    app.listen(PORT, () => {
      console.log('Server has been started...')
    })
  }
  catch (e) {
    console.log(e)
  }
}

start()
