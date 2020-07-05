// comments

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
}) 

app.post('/shortUrls', async (req, res) => {
    if (req.body.slug)
    await ShortUrl.create({ full: req.body.fullUrl, slug: req.body.slug })
    else await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:slug', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ slug: req.params.slug })
    if (shortUrl  == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);