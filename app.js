const express = require('express'); 
const app = express(); 
const port = 3000; 
var path = require('path');


//motor de plantillas (ejs)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.use(express.static(__dirname + "/public"))

app.use(express.urlencoded({ extended: true}))

//Rutas de la web
app.
use('/', require('./routes/index'));
// app.use('/comprar', require('./routes/comprar'));
// app.use('/login', require('./routes/login'));
// app.use('/signup', require('./routes/signup'));
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