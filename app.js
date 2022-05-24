const express = require('express')
const app = express()
const port = 3000
const exphts = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))

const Restaurant = require('./models/restaurant')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('handlebars', exphts({ defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurant => { res.render('index', { restaurant }) })
    .catch(error => console.log(error))
  
})

app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => {res.redirect('/')})
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurants.results.find(item => req.params.id === item.id.toString())
  res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const restaurant = restaurants.results.filter(item => {
    if (item.name.toLowerCase().includes(keyword) 
    || item.category.toLowerCase().includes(keyword)) {
      return item
    }
  })

  res.render('index', { restaurant: restaurant, keyword: keyword })
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})