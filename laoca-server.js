//instalar express en este ejemplo si no lo teníamos

var fs=require("fs");
var config=JSON.parse(fs.readFileSync("./server/config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var application_root = __dirname,
	path = require('path');
var modulo = require('./server/laOca.js');
var juego;

var app=exp(); 

app.use('/',exp.static(__dirname));

app.get("/",function(request,response){
	var contenido=fs.readFileSync("./client/index-juego.html");
	if(!juego){
        juego=modulo.iniJuego();
    }
	response.setHeader("Content-type","text/html");
	response.send(contenido);
});

app.get("/reset",function(request,response){
	juego = modulo.iniJuego();
	console.log("Fase:"+juego.fase.nombre);
	response.send({"res":"ok"});
});

app.get("/hayJugadores",function(req,res){
	var jsonData;
	if (juego.coleccionJugadores.length==juego.coleccionFichas.length){
		jsonData={"res":"ok"};
	}
	else{
		jsonData={"res":"nook"};
	}
	res.send(jsonData);
});

app.get("/turno/:color",function(req,res){
	var jugador = juego.buscarJugador(req.params.color);
	var jsonData;
	if (jugador){
		jsonData={"turno":jugador.turno.nombre}
	}
	else{
		jsonData={"turno":"fallo"}
	}
	res.send(jsonData);
})

app.get("/lanzar/:color",function(res,req){
	var jugador = juego.buscarJugador(color);
	var jsonData;
	if (jugador){
		jugador.lanzar();
		jsonData={
			"posicion":juego.ficha.casilla.posicion,
			"estado" : juego.estado.nombre
		}
	}
	else{
		jsonData={"res":"error"}
	}
	res.send(jsonData);
});

app.get("/ficha/:nombre",function(request,response){
	jugador = new modulo.Jugador(request.params.nombre,juego);
	jugador.asignarFicha();
	if (jugador.ficha){
        var jsonData={
            "color":jugador.ficha.color,
            "posicion":jugador.ficha.casilla.posicion
        };
        response.send(jsonData);
    }
    else{
        response.send("No hay mas huecos, sorry");
    }
})

app.listen(port,host);
console.log("Servidor iniciado en puerto: "+port);

