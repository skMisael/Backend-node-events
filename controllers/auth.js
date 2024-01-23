//controlador de funciones auth
const {response} = require('express');//esta linea solo sirve para el auto completado
//encriptador
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async(req, res = response)=>{    
  
    const { email, password} = req.body;

    //base de datos
    try {
        //validacion email no repetido
        let usuario = await Usuario.findOne({email});
        if(usuario){
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
            
        }
        usuario = new Usuario(req.body);
        //encriptar contrasena
        const salt =bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);
        await usuario.save(); 

        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });  
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
    

   
}

const loginUsuario = async (req, res = response)=>{    
    
    const { email, password} = req.body;
    
    try {
        //buscamos correo
        const  usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });            
        }
        //validamos password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password no valida'
            });            
        }

        //Generar nuestro token JWT
        //generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
   
}

const revalidarToken = async (req, res = response)=>{
    const {uid, name} = req;
    //generar un nuevo json y retornarlo
    const token = await generarJWT(uid, name);

    res.json({
        ok:true,
        token
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}