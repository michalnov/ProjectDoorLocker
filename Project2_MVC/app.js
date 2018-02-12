const express= require('express');
const mongo = require('mongodb'); 
const mongoose= require('mongoose');
const path = require('path'); 
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); 
const exphbs = require('express-handlebars'); 
const expressValidator = require('express-validator'); 
const flash = require('connect-flash'); 
const session = require('express-session'); 
const passport = require('passport'); 
const LocalStrategy = require('passport-local').strategy; 


//routes
const index = require('./routes/index');


//Application init
const app=express();

//view engine
app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine','handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Ex session
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));

// Init passport
app.use(passport.initialize());
app.use(passport.session());

// Ex messages
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//Ex validator
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        let namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

app.use('/', index);


app.get('/', (req,res)=>{
    res.send('It works!');
});
//Start Server
app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'),()=>{
    console.log('Server started on port '+app.get('port'));
});