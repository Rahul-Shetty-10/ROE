const express = require("express")

const app = express()
const PORT = 3000;

require('dotenv').config()
const passport = require('passport');
require('../helper/passport');

const bodyParser = require('body-parser')
const session = require('express-session')

const adminRoutes = require('../router/admin_route');
const userRoutes = require('../router/user_route');
const authRoutes = require('../router/auth_route');

const path = require("path")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const viewsPath = path.join(__dirname, '../templates/views')
const staticPath = path.join(__dirname, '../../public/assets')

app.use(express.static(staticPath));
app.set('view engine', 'ejs');
app.set('views', viewsPath);


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 7200000 },
    })
)

app.use(passport.initialize());
app.use(passport.session());

app.use('/', adminRoutes);
app.use('/', userRoutes);
app.use('/', authRoutes);

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    next();
});

app.use('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
            res.status(500).send('Error destroying session');
        } else {
            console.log('session destroyed')
            res.redirect('/')
        }

    })
})

app.use(function(req, res, next) {
    res.status(404);
    res.render('user/error404');
});

app.use(function(req, res, next) {
    res.status(500);
    res.render('user/error500');
});



app.listen(PORT, () => {
    console.log(`Server running on ${PORT} and database connected`);
});

module.exports = app;