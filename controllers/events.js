const {response} = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req, res = response) =>{
    const eventos = await Evento.find().populate('user','name');
    res.json({
        ok:true,
        eventos
    });
}

const crearEvento = async(req, res = response) =>{
    //const {title,start,end} = req.body;
    try {        
        const evento = new Evento(req.body);
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.json({
            ok:true,
            evento: eventoGuardado
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg:'Hable con el administrado'
        });
    }   
    
}

const actualizarEvento = async (req, res = response) =>{
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar el evento'
            });
        }
        const nuevoEvento ={
            ...req.body,
            user:uid
        }
    const eventoActualizado = await Evento.findByIdAndUpdate(eventoId,nuevoEvento,{new:true});
    res.json({
        ok:true,
        evento: eventoActualizado
    });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
   
}


const eliminarEvento = async (req, res=response) =>{
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar el evento'
            });
        }
         await Evento.findByIdAndDelete(eventoId);
        res.json({
            ok:true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el adminstrador'
        });
    }
   
}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}