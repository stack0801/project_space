const express_session = require('express-session')
const mongodb_session = require('connect-mongodb-session')(express_session)
require('dotenv').config()

const S_store = new mongodb_session({
    uri : process.env.DB_uri,
    collection : 'S_session'
})

S_store.on('error', function(error) {
    console.log(error)
})

module.exports = (app) => {
    app.use(express_session({
        secret: process.env.session_secret,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 1 // 1 day
        },
        store : S_store,
        resave: true,
        saveUninitialized: true
    }))
}