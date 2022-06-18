const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();


app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.set('view engine', 'ejs');

//------------ Bodyparser Configuration ------------//
app.use(express.urlencoded({ extended: false }))

//------------ Express session Configuration ------------//
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
var RewriteMiddleware = require('express-htaccess-middleware');
var RewriteOptions = {
    file: path.resolve(__dirname, '.htaccess'),
    verbose: (process.env.ENV_NODE == 'development'),
    watch: (process.env.ENV_NODE == 'development'),
};


app.use(RewriteMiddleware(RewriteOptions));

//------------ Connecting flash ------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
//------------ Routes ------------//
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3007;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));