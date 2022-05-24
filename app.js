const { Router } = require('express');
const express = require('express'); 
const app = express(); 
const port = 3000; 
const session = require('express-session')
var path = require('path');


//motor de plantillas (ejs)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));


//Sessiones
app.use(session({
    secret: 'tapasdera_carlus',
    resave: false,
    saveUninitialized: false,
    name:"secreto-name-turutu", 
    cookie: { secure: false }
  }))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// use a middleware function
// app.use("/", (req, res, next) => {
//     console.log("first")
//     next();
//   });

var auth = function(req, res, next) {
  if (!req.session.email)
    return next();
  else
    return res.sendStatus(401);
};


//Rutas de la web
app.use('/', require('./routes/index'));
app.use('/productos', require('./routes/productos'));
app.use('/login', require('./routes/login'));
app.use('/signup', require('./routes/signup'));
// app.use('/support', require('./routes/support'));

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () =>{
    console.log('El puerto en el que escucha', port); 
})

//se llama middleware 
app.use((req, res, next)  => {
    res.status(404).render("404", {
        titulo:"404", 
        descrip: "No se ha encontrado :("
    })
}) 