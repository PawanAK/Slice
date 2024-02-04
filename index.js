require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const requireAuth = require('./middleware/requireAuth')

const PORT = 4000

const usersRouter = require('./routes/userRouter')
const expenseRouter = require('./routes/expenseRouter')
const groupRouter = require('./routes/groupRouter')

// express app
const app = express()


// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes

app.use('/api/users', usersRouter)
app.use('/api/group', requireAuth, groupRouter)
app.use('/api/expense', requireAuth, expenseRouter)


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(PORT, () => {
      console.log('listening for requests on port', PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 