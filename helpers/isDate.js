const moment = require('moment');

//validacion custom
const isDate = (value, {req, location, path}) =>{
    //campo no correcto vacio
    if(!value){
        return false;
    }

    const fecha = moment(value);
    if(fecha.isValid()){
        return true;
    }else{
        return false;
    }    
}

module.exports = {isDate};