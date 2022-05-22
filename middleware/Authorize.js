const session = require("express-session");

module.exports = function (req, res, next){
    if(!session){
        res.redirect("/"); 
    }
} 