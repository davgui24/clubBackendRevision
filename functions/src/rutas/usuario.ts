import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as moment from 'moment';
const excel = require('node-excel-export');


const app = express();
app.use(cors({ origin: true }));
const db = admin.firestore();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

// CREAR USUARIOS
app.post('/crearUsuario', async (req, res) => {
    const uid = String(req.body.identificacion);
    const identificacion = String(req.body.identificacion);
    const email = req.body.email;
    const password = req.body.password;
    const nombres = req.body.nombres;
    const avatar = req.body.email;
    const municipio = req.body.municipio;
    const telefono = req.body.telefono;
    const terminos = true;
    const codigoLider = req.body.codigoLider || '';
    const codigoPasajero = req.body.codigoPasajero || '';
    const codigoTransportador = req.body.codigoTransportador || '';
    const codigo1 = req.body.codigo1 || '';
    const placaMoto = req.body.placaMoto || '';
    const placaCarro = req.body.placaCarro || '';


    let habilitadoCarroCarrera: any;
    let habilitadoCarroMensajeria: any;
    let habilitadoMotoCarrera: any;
    let habilitadoMotoMensajeria: any;
    let cambioUsuario: any;
    let habilitadoPasajero: any;
    let habilitadoLider: any;
    let habilitadoTransportador: any;
    let habilitadoMotoSpeedy: any;
    let habilitadoCarroSpeedy: any;

    if (req.body.cambioUsuario) {
        cambioUsuario = JSON.parse(req.body.cambioUsuario)
    } else {
        cambioUsuario = false;
    }


    if (req.body.habilitadoPasajero) {
        habilitadoPasajero = JSON.parse(req.body.habilitadoPasajero)
    } else {
        habilitadoPasajero = false;
    }

    if (req.body.habilitadoLider) {
        habilitadoLider = JSON.parse(req.body.habilitadoLider)
    } else {
        habilitadoLider = false;
    }


    if (req.body.habilitadoTransportador) {
        habilitadoTransportador = JSON.parse(req.body.habilitadoTransportador)
    } else {
        habilitadoTransportador = false;
    }


    if (req.body.habilitadoMotoSpeedy) {
        habilitadoMotoSpeedy = JSON.parse(req.body.habilitadoMotoSpeedy);
        if (habilitadoMotoSpeedy == true) {
            habilitadoMotoCarrera = true;
            habilitadoMotoMensajeria = true;
        } else {
            habilitadoMotoCarrera = false;
            habilitadoMotoMensajeria = false;
        }
    } else {
        habilitadoMotoSpeedy = false;
        habilitadoMotoCarrera = false;
        habilitadoMotoMensajeria = false;
    }


    if (req.body.habilitadoCarroSpeedy) {
        habilitadoCarroSpeedy = JSON.parse(req.body.habilitadoCarroSpeedy);
        if (habilitadoCarroSpeedy == true) {
            habilitadoCarroCarrera = true;
            habilitadoCarroMensajeria = true;
        } else {
            habilitadoCarroCarrera = false;
            habilitadoCarroMensajeria = false;
        }
    } else {
        habilitadoCarroSpeedy = false;
        habilitadoCarroCarrera = false;
        habilitadoCarroMensajeria = false;
    }





    const historicoPasajero: any[] = [];
    const historicoMotoSpeedy: any[] = [];
    const historicoCarroSpeedy: any[] = [];
    const saldoMotoSpeedy = 0;
    const saldoMotoCarroSpeedy = 0;
    const motoOcupada = false;
    const carroOcupado = false;
    let usuarioIdLider = req.body.usuarioIdLider || '';
    const fechaCreacion = new Date().getTime().toString();
    const fechaActualizacion = new Date().getTime().toString();
    const ultimoLogin = new Date().getTime().toString();
    const mensajeServidor: any[] = [];
    mensajeServidor.push({
        id: new Date().getTime().toString(),
        message: 'Sr Usuario Felicidades, ahora perteneces al gran Club Speedy.',
        visto: false,
    })

    const usuarios = db.collection('usuarios');



    // VALIDAMOS QUE EL CODIGO DEL LIDER EXISTA
    let validarPasajero: boolean = true;
    if (req.body.codigo1) {
        await usuarios.where('codigoLider', '==', codigo1).get().then(async snapshotLider => {
            if (snapshotLider.empty) {
                validarPasajero = false;
                res.status(400).json({
                    ok: false,
                    message: 'El código líder no existe.'
                });
                return
            } else {
                snapshotLider.forEach(doc => {
                    usuarioIdLider = doc.data().id;

                })
            }
        }).catch(function (error: any) {
            res.status(400).json({
                ok: false,
                message: 'Error buscando codigo del lider',
            });
            return;
        })
    } else {
        usuarioIdLider = '';
    }

    if (!validarPasajero) {
        return;
    }


    // VALIDAMOS QUE EL CODIGO LIDER NO SE REPITA
    let validaCodigoLider: boolean = true;
    if (codigoLider) {
        await usuarios.where('codigoLider', '==', codigoLider).get().then(async snapshotEmail => {
            if (snapshotEmail.empty) {
                validaCodigoLider = true;
            } else {
                res.status(400).json({
                    ok: false,
                    message: 'No hay lider con este código.'
                });
                validaCodigoLider = false;
            }
        })
    }
    if (!validaCodigoLider) {
        return;
    }


    // VALIDAMOS QUE SEA UN TRASPORTADOR
    if (habilitadoTransportador === true) {
        console.log('ENTRO 1');
        cambioUsuario = true;
        habilitadoPasajero = true;
        if (habilitadoCarroSpeedy === true && habilitadoMotoSpeedy === true) {
            console.log('ENTRO 2', habilitadoCarroSpeedy);

            habilitadoCarroSpeedy = true;
            habilitadoMotoSpeedy = true;
            habilitadoCarroCarrera = true;
            habilitadoCarroMensajeria = true;
            habilitadoMotoCarrera = true;
            habilitadoMotoMensajeria = true;
        } else if (habilitadoMotoSpeedy === true && habilitadoCarroSpeedy === false) {
            console.log('ENTRO 3');
            habilitadoCarroSpeedy = false;
            habilitadoMotoSpeedy = true;
            habilitadoMotoCarrera = true;
            habilitadoMotoMensajeria = true;
        } else if (habilitadoMotoSpeedy === false && habilitadoCarroSpeedy === true) {
            console.log('ENTRO 4');
            habilitadoCarroSpeedy = true;
            habilitadoMotoSpeedy = false;
            habilitadoCarroCarrera = true;
            habilitadoCarroMensajeria = true;
        }
    }

    // VALIDAMOS QUE SEA UN PASAJERO
    if (habilitadoPasajero) {
        cambioUsuario = false;
    }


    await usuarios.where('email', '==', email).get().then(async snapshotEmail => {
        if (snapshotEmail.empty) {
            await usuarios.where('identificacion', '==', identificacion).get().then(async snapshotIdentificacion => {
                if (snapshotIdentificacion.empty) {
                    await db.collection('usuarios').add({
                        id: new Date().getTime(),
                        uid: uid,
                        identificacion: identificacion,
                        email: email,
                        password: password,
                        nombres: nombres,
                        avatar: avatar,
                        municipio: municipio,
                        telefono: telefono,
                        terminos: terminos,
                        codigoLider: codigoLider,
                        codigoPasajero: codigoPasajero,
                        codigoTransportador: codigoTransportador,
                        codigo1: codigo1,
                        habilitado: true,
                        cambioUsuario: cambioUsuario,
                        habilitadoPasajero: habilitadoPasajero,
                        habilitadoLider: habilitadoLider,
                        habilitadoTransportador: habilitadoTransportador,
                        habilitadoMotoSpeedy: habilitadoMotoSpeedy,
                        habilitadoCarroSpeedy: habilitadoCarroSpeedy,
                        habilitadoCarroCarrera: habilitadoCarroCarrera,
                        habilitadoCarroMensajeria: habilitadoCarroMensajeria,
                        habilitadoMotoCarrera: habilitadoMotoCarrera,
                        habilitadoMotoMensajeria: habilitadoMotoMensajeria,
                        historicoPasajero: historicoPasajero,
                        historicoMotoSpeedy: historicoMotoSpeedy,
                        historicoCarroSpeedy: historicoCarroSpeedy,
                        habilitadoComision: false,
                        saldoMotoSpeedy: saldoMotoSpeedy,
                        saldoMotoCarroSpeedy: saldoMotoCarroSpeedy,
                        motoOcupada: motoOcupada,
                        carroOcupado: carroOcupado,
                        usuarioIdLider: usuarioIdLider,
                        fechaCreacion: fechaCreacion,
                        pagoComisiones: [],
                        fechaActualizacion: fechaActualizacion,
                        ultimoLogin: ultimoLogin,
                        placaMoto: placaMoto,
                        placaCarro: placaCarro,
                        mensajeServidor: mensajeServidor,
                    }).then((metadata) => {
                        res.status(200).json({
                            ok: true,
                            message: 'usuario ' + nombres + ' Agregado Exitosamente'
                        });
                    }).catch(function (error: any) {
                        res.status(400).json({
                            ok: false,
                            message: 'Error al registrar al usuario 001', error
                        });
                        return;
                    })
                } else {
                    res.status(401).json({
                        ok: false,
                        message: 'Ya existe esta identificación en la base de datos. 002'
                    });
                    return;
                }
            }).catch(function (error: any) {
                res.status(400).json({
                    ok: false,
                    message: 'Error con el numero de identificacion o usuario no existe',
                });
                return;
            })

        } else {
            res.status(401).json({
                ok: false,
                message: 'Ya existe este email en la base de datos. 003',
                email
            });
            return;
        }
    }).catch(function (error: any) {
        res.status(400).json({
            ok: false,
            message: 'Error con el email o usuario no existe', error
        });
        return;
    })




});


// ============== LOGIN DE USUARIO 
app.post('/login', async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const usuariosRef = db.collection('usuarios');

    await usuariosRef.where('email', '==', email).get().then(snapshot => {

        if (snapshot.empty) {
            res.status(400).json({
                ok: false,
                message: 'Usuario incorrecto'
            });
            return;
        } else {
            snapshot.forEach(doc => {

                // Recuperamos el usurio de la base de datos
                const usuario = doc.data();

                // VALIDAMOS QUE EL LA CONTRASEÑA SEA CORRECTA
                if (usuario.password !== password) {
                    res.status(400).json({
                        ok: false,
                        message: 'Credenciales Incorrectas'
                    });
                    return;
                } else {

                    // escondemos pa contaseña y creamos el token
                    usuario.password = ':)';
                    return res.status(200).json({
                        ok: true,
                        usuario
                    })

                }
            });
        }
    }).catch(err => {
        console.log('Error Obteniendo Documentos', err);
    });
})

app.post('/editApp', async (req, res) => {

    const email = req.body.email;
    const nombres = req.body.nombres;
    const municipio = req.body.municipio;
    const telefono = req.body.telefono;


    const usuariosRef = db.collection('usuarios');
    await usuariosRef.where('email', '==', email).get().then(async snapshotUser => {
        if (snapshotUser.empty) {
            console.log('Usuario ' + email + ' no existe en nuestra base dedatos');
            res.status(400).json({
                ok: false,
                message: 'Usuario ' + email + ' no existe en nuestra base de datos'
            });
            return
        } else {
            //recorremos el arreglo los snapshotUser
            snapshotUser.forEach(async doc => {
                const usuario = doc.data();
                usuario.nombres = nombres;
                usuario.municipio = municipio;
                usuario.telefono = telefono;
                const idUserDoc = doc.id;  //  este es el id del documento
                const usuarioModificado = usuario;
                //Actulizamos usuario en la coleccion
                await db.collection('usuarios').doc(idUserDoc).set(usuarioModificado).then(async usuarioActualizado => {
                    console.log('Usuario ' + email + ' Actualizado Exitosamente');
                    res.status(200).json({
                        ok: true,
                        message: 'Usuario ' + email + ' Actualizado Exitosamente',
                    });

                }).catch(function (error: any) {
                    //catch de await usuario modificiado
                    console.log('USUARIO' + email + ' ERROR ', error);

                    res.status(400).json({
                        ok: false,
                        message: 'Error al Actulizar usuario ',
                    });
                    return;
                });
            });
        }

    }).catch(function (error: any) {
        //catch de await email
        console.log('Usuario ' + email + ' no existe en nuestra base de datos', error);
        res.status(200).json({
            ok: false,
            message: 'Error al registrar el usuario, este email No existe o tiene un formato incorrecto.'
        });
    })
})

app.post('/editWeb', async (req, res) => {

    let email = req.body.email;
    let identificacion = req.body.identificacion;
    let password = req.body.password;
    let nombres = req.body.nombres;
    let municipio = req.body.municipio;
    let telefono = req.body.telefono;
    let codigoLider = req.body.codigoLider;
    let codigoPasajero = req.body.codigoPasajero;
    let codigoTransportador = req.body.codigoTransportador;
    let codigo1 = req.body.codigo1;

    let habilitado = req.body.habilitado;
    let cambioUsuario = req.body.cambioUsuario;
    let habilitadoPasajero = req.body.habilitadoPasajero;
    let habilitadoLider = req.body.habilitadoLider;
    let habilitadoTransportador = req.body.habilitadoTransportador;
    let habilitadoMotoSpeedy = req.body.habilitadoMotoSpeedy;
    let habilitadoCarroSpeedy = req.body.habilitadoCarroSpeedy;



    let saldoMotoSpeedy = req.body.saldoMotoSpeedy;
    let saldoMotoCarroSpeedy = req.body.saldoMotoCarroSpeedy;
    let fechaActualizacion = new Date().getTime().toString();
    let mensajeServidor: any[] = [];
    let placaMoto = req.body.placaMoto;
    let placaCarro = req.body.placaCarro;


    let habilitadoMotoCarrera: any;
    let habilitadoMotoMensajeria: any;
    let habilitadoCarroMensajeria: any;
    let habilitadoCarroCarrera: any;

    if (JSON.parse(habilitadoLider) === true) {
        codigoLider = codigoPasajero;
    }

    if (JSON.parse(habilitadoTransportador) === true) {
        codigoTransportador = codigoPasajero;
        if(JSON.parse(habilitadoMotoSpeedy) == true){
            habilitadoMotoCarrera = true;
            habilitadoMotoMensajeria = true;
        }else{
            habilitadoMotoCarrera = false;
            habilitadoMotoMensajeria = false;
        }

        if(JSON.parse(habilitadoCarroSpeedy) == true){
            habilitadoCarroCarrera = true;
            habilitadoCarroMensajeria = true;
        }else{
            habilitadoCarroCarrera = false;
            habilitadoCarroMensajeria = false;
        }
    }else{
        codigoTransportador = '';
    }


    if(JSON.parse(habilitadoMotoSpeedy )== false && JSON.parse(habilitadoCarroSpeedy) == false){
        habilitadoTransportador = 'false';
        codigoTransportador = '';
        placaCarro = '';
        placaMoto = '';
        // saldoMotoCarroSpeedy = 0;
        // saldoMotoSpeedy = 0;
    }

    mensajeServidor.push({
        id: new Date().getTime().toString(),
        message: 'Usuario actualizado el dia de hoy',
        visto: false
    })

    const usuariosEmail = db.collection('usuarios');
    // validamos que exista el email en la coleccion
    await usuariosEmail.where('email', '==', email).get().then(async snapshotUser => {
        if (snapshotUser.empty) {
            console.log('Usuario ' + email + ' no existe en nuestra base dedatos');
            res.status(400).json({
                ok: false,
                message: 'Usuario ' + email + ' no existe en nuestra base de datos'
            });
            return
        } else {
            //recorremos el arreglo los snapshotUser
            snapshotUser.forEach(doc => {
                let usuario = doc.data();
                usuario.email = email;
                usuario.identificacion = identificacion;
                usuario.password = password;
                usuario.nombres = nombres;
                usuario.municipio = municipio;
                usuario.telefono = telefono;
                usuario.codigoLider = codigoLider;
                usuario.codigoPasajero = codigoPasajero;
                usuario.codigoTransportador = codigoTransportador;
                usuario.codigo1 = codigo1;
                usuario.habilitado = JSON.parse(habilitado);
                usuario.cambioUsuario = cambioUsuario;
                usuario.habilitadoPasajero = JSON.parse(habilitadoPasajero);
                usuario.habilitadoLider = JSON.parse(habilitadoLider);
                usuario.habilitadoTransportador = JSON.parse(habilitadoTransportador);
                usuario.habilitadoMotoSpeedy = JSON.parse(habilitadoMotoSpeedy); 
                usuario.habilitadoMotoCarrera = habilitadoMotoCarrera; 
                usuario.habilitadoMotoMensajeria = habilitadoMotoMensajeria; 
                usuario.habilitadoCarroMensajeria = habilitadoCarroMensajeria; 
                usuario.habilitadoCarroCarrera = habilitadoCarroCarrera; 
                usuario.habilitadoCarroSpeedy = JSON.parse(habilitadoCarroSpeedy);
                usuario.saldoMotoSpeedy = JSON.parse(saldoMotoSpeedy);
                usuario.saldoMotoCarroSpeedy = JSON.parse(saldoMotoCarroSpeedy);
                usuario.fechaActualizacion = fechaActualizacion;
                usuario.placaMoto = placaMoto;
                usuario.placaCarro = placaCarro;
                usuario.mensajeServidor = mensajeServidor;
                const idUserDoc = doc.id; //  este es el id del documento
                const usuarioModificado = usuario;
                console.log(usuario);
                //Actulizamos usuario en la coleccion
                db.collection('usuarios').doc(idUserDoc).set(usuarioModificado).then(usuarioActualizado => {
                    console.log('Usuario ' + email + ' Actualizado Exitosamente');
                    res.status(200).json({
                        ok: true,
                        message: 'Usuario ' + email + ' Actualizado Exitosamente',
                    });
                }).catch(function (error: any) {
                    //catch de await usuario modificiado
                    console.log('USUARIO' + email + ' ERROR ', error);
                    res.status(400).json({
                        ok: false,
                        message: 'Error al Actulizar usuario ',
                    });
                    return;
                });
            });//fin de snapuser
        }//fin del else
    })
    // .catch(function (error: any) {
    //     //catch de await identificacion
    //     console.log('Usuario ' + email + ' no existe en nuestra base de datos', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'Error al Editar el usuario, este email No existe o tiene un formato incorrecto.'
    //     });

    // });
});

app.post('/editarEstadoNotificacion', async (req, res) => {

    // RECUPERAMOS los datos que viene por post y lo guardamos en un objeto
    const identificacion = req.body.identificacion;
    const idNotificacion = req.body.idNotificacion;
    // VALIDAMOS QUE EL IDENTIDAD QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const usuariosRef = db.collection('usuarios');
    await usuariosRef.where('identificacion', '==', String(identificacion)).get().then(async snapshotId => {
        if (snapshotId.empty) {
            // NO ESXISTE ESTE USURIO EN A BASE DE DATOS
            res.status(401).json({
                ok: false,
                message: 'No existe este usuario en la base de datos.'
            });
        } else {
            // EXISTE EL USUARIO EN LA BASE DE DATOS Y PROSEDEMOS A ACTUALIZAR SUS DATOS
            snapshotId.forEach(doc => {
                // Recuperamos el usurio de la base de datos
                // tslint:disable-next-line:prefer-const
                let usuario = doc.data();
                // BUSCAMOS LA NOTIFICACION´POR EL ID
                // tslint:disable-next-line:prefer-const

                for (let nota of usuario.mensajeServidor) {
                    if (nota.id === idNotificacion) {
                        nota.visto = true;
                        break;
                    }
                }

                // console.log('Por aqui paso', usuario);
                // Actualizamos el usuario de la base de datos en el local
                const idUserDoc = doc.id;  //  este es el id del documento
                db.collection('usuarios').doc(idUserDoc).set(usuario).then(usuarioActualizado => {
                    if (usuarioActualizado) {
                        res.status(200).json({
                            ok: true,
                            messaje: 'Cambios de estado Exitosamente',
                            mensaje: usuario.mensajeServidor
                        });
                        return;
                    }
                }, error => {
                    return res.status(401).json({
                        ok: false,
                        messaje: 'Error al actualizar el cambiar el estado del usuario',
                        error
                    });
                })



            })

        }
    });
})

app.post('/userDeleteWeb', async (req, res) => {

    // RECUPERAMOS los datos que viene por la URL
    const email = req.body.email;

    console.log(email);
    console.log(typeof (email));

    // VALIDAMOS QUE LA IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const usuariosRef = db.collection('usuarios');
    await usuariosRef.where('email', '==', email).get().then(async snapshotDelete => {
        if (snapshotDelete.empty) {
            // NO ESXISTE ESTE USURIO EN A BASE DE DATOS
            res.status(401).json({
                ok: false,
                message: 'No existe este usuario en la base de datos.'
            });

        } else {

            // EXISTE EL USUARIO EN LA BASE DE DATOS Y PROSEDEMOS A ELIMAR SUS DATOS
            snapshotDelete.forEach(doc => {
                const idUserDoc = doc.id;
                const usuarioEliminado1 = doc.data();
                //  este es el id del documento
                //primero enviamos al usuarioa coleccion usuario eliminado
                // tslint:disable-next-line:ban-comma-operator
                db.collection('usuariosEliminados').add({
                    usuarioEliminado1,
                }).then(ref => {
                    console.log('Usuario agregado a coleccion eliminados exitosamente');
                }).catch(function (error: any) {
                    console.log('Error al intentar eliminar usuario 001 ', error);
                    res.status(400).json({
                        ok: false,
                        message: 'Error al intentar eliminar usuario',
                    });
                    return;
                })
                //Elimanos de la coleccion usuarios
                // tslint:disable-next-line:no-shadowed-variable
                db.collection('usuarios').doc(idUserDoc).delete().then(usuarioEliminado2 => {
                    if (usuarioEliminado2) {
                        res.status(200).json({
                            ok: true,
                            message: 'usuario Eliminado',
                        });
                        return;
                    }
                }).catch(function (error: any) {
                    console.log('Error al intentar eliminar usuario 002 ', error);
                    res.status(400).json({
                        ok: false,
                        message: 'Error al intentar eliminar usuario',
                    });
                    return;
                })
            });
        }

    }).catch(function (error: any) {
        console.log('Usuario No Existe ', error);
        res.status(400).json({
            ok: false,
            message: 'Usuario No Existe',
        });
        return;
    })
})



app.get('/usuarios', async (req, res) => {

    const usuariosRef = db.collection('usuarios');
    const docsSnapshot = await usuariosRef.get();

    const usuarios = docsSnapshot.docs.map(doc => doc.data());

    if (usuarios) {
        return res.status(200).json({
            ok: true,
            usuarios
        });
    } else {
        return res.status(400).json({
            ok: false,
            message: 'No se pudieron obtener los usuarios.'
        })
    }
})


app.get('/usuariosExcel', async (req, res) => {

    const usuariosRef = db.collection('usuarios');
    const docsSnapshot = await usuariosRef.get();

    const usuarios = docsSnapshot.docs.map(doc => doc.data());

    if (usuarios) {
            // You can define styles as json object
    const styles = {
        headerDark: {
          fill: {
            fgColor: {
              rgb: 'FF000000'
            }
          },
          font: {
            color: {
              rgb: 'FFFFFFFF'
            },
            sz: 14,
            bold: true,
            underline: true
          }
        },
        cellPink: {
          fill: {
            fgColor: {
              rgb: 'FFFFCCFF'
            }
          }
        },
        cellGreen: {
          fill: {
            fgColor: {
              rgb: 'FF00FF00'
            }
          }
        }
      };
       
      //Array of objects representing heading rows (very top)
      const heading = [
        [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
        ['a2', 'b2', 'c2'] // <-- It can be only values
      ];
       
      //Here you specify the export structure
      const specification = {
        nombres: { // <- the key should match the actual data key
          displayName: 'Nombre', // <- Here you specify the column header
          headerStyle: styles.headerDark, // <- Header style
          width: 300 // <- width in pixels
        },
        email: {
          displayName: 'Email',
          headerStyle: styles.headerDark,
          width: 300 // <- width in chars (when the number is passed as string)
        },
        identificacion: {
          displayName: 'Identidad',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        telefono: {
          displayName: 'Teléfono',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        codigo1: {
          displayName: 'Código de mi lider',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        codigoPasajero: {
          displayName: 'Mi código pasajero',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        codigoTransportador: {
          displayName: 'Mi código trasnsportador',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        codigoLider: {
          displayName: 'Mi código líder',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        habilitadoPasajero: {
          displayName: 'Habilitado pasajero',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        habilitadoTransportador: {
          displayName: 'Habilitado transportador',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
        habilitadoLider: {
          displayName: 'Habilitado líder',
          headerStyle: styles.headerDark,
          width: 220 // <- width in pixels
        },
      }
       
      // The data set should have the following shape (Array of Objects)
      // The order of the keys is irrelevant, it is also irrelevant if the
      // dataset contains more fields as the report is build based on the
      // specification provided above. But you should have all the fields
      // that are listed in the report specification

      let users: any[] = [];

      for(let user of usuarios){
          let u =   {
            nombres: user.nombres, 
            email: user.email,
            identificacion: user.identificacion,
            telefono: JSON.stringify(user.telefono),
            codigo1: user.codigo1,
            codigoPasajero: user.codigoPasajero,
            codigoTransportador: user.codigoTransportador,
            codigoLider: user.codigoLider,
            habilitadoPasajero: JSON.stringify(user.habilitadoPasajero),
            habilitadoTransportador: JSON.stringify(user.habilitadoTransportador),
            habilitadoLider: JSON.stringify(user.habilitadoLider),
          };

          users.push(u);
      }

       
      // Define an array of merges. 1-1 = A:1
      // The merges are independent of the data.
      // A merge will overwrite all data _not_ in the top-left cell.
      const merges = [
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
        { start: { row: 2, column: 6 },end: { row: 2, column: 19 }},
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
        { start: { row: 2, column: 6 }, end: { row: 2, column: 19 } },
      ]
       
      // Create the excel report.
      // This function will return Buffer
      const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
          {
            name: 'usuarios', // <- Specify sheet name (optional)
            heading: heading, // <- Raw heading array (optional)
            merges: merges, // <- Merge cell ranges
            specification: specification, // <- Report specification
            data: usuarios // <-- Report data
          }
        ]
      );
       
      // You can then return this straight
      res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
      return res.send(report);
    } else {
        return res.status(400).json({
            ok: false,
            message: 'No se pudieron obtener los usuarios.'
        })
    }
})



// TODOS LOS LIDERES QUE NO DEPENDEN DE NADIE
app.get('/lideresRaiz', async (req, res) => {

    const usuariosRef = db.collection('usuarios');
    const docsSnapshot = await usuariosRef.get();

    const usuarios = docsSnapshot.docs.map(doc => doc.data());
    let lideresRaiz: any[] = [];
    let liderRaiz;

    for(let usuario of usuarios){

        if(usuario.codigo1 == usuario.codigoLider){

            liderRaiz = {
                codigo1: usuario.codigo1,
                codigoLider: usuario.codigoLider,
                email: usuario.email,
                nombres: usuario.nombres
            }
            lideresRaiz.push(liderRaiz);
        }
    }

    if (usuarios) {
        return res.status(200).json({
            ok: true,
            lideresRaiz
        });
    } else {
        return res.status(400).json({
            ok: false,
            message: 'No se pudieron obtener los usuarios.'
        })
    }
})



app.post('/transferirAOtroLider', async (req, res) => {

    const usuariosRef = db.collection('usuarios')

    




        await usuariosRef.where('email', '==', req.body.email).get().then(async snapshot => {

           snapshot.forEach(async (doc) => {
                let idUserDoc = doc.id;
                let user = doc.data();
                if (user.codigo1 == 'BO1014200688' || user.codigo1 == 'BO39534151') {
                    user.codigo1 = 'CA38556933';
                    await db.collection('usuarios').doc(idUserDoc).set(user).then(async usuarioActualizado => {
                        if(await usuarioActualizado){
                            res.status(200).json({
                                ok: true,
                                userCoadigo: user.codigo1,
                                userEmail: user.email
                            });
                            return;                   
                        }else{
                            res.status(400).json({
                                ok: false,
                                message: 'No se pudieron obtener los usuarios.'
                            }); 
                        }
                    });
                   
                }
            });

            


        // if(usuario.codigo1 == 'BO1014200688' || usuario.codigo1 == 'BO39534151'){
        //     usuario.codigo1 = 'CA38556933';

        //     usuariosTransferidos.push(usuario);
        // }

        });  
})




app.post('/finalizarSolicitudTransportador', async (req, res) => {

    const email = req.body.email;
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);

    const usuariosRef = db.collection('usuarios');

    await usuariosRef.where('email', '==', email).get().then(snapshot => {

        if (snapshot.empty) {
            res.status(400).json({
                ok: false,
                message: 'No se encontró sus usuario en la base de datos.'
            });
            return;
        } else {
            snapshot.forEach(doc => {

                // Recuperamos el usurio de la base de datos
                const usuario = doc.data();

                usuario.latitude = latitude;
                usuario.longitude = longitude;

                const idUserDoc = doc.id;
                // tslint:disable-next-line: no-floating-promises
                db.collection('usuarios').doc(idUserDoc).set(usuario).then(usuarioModificado => {
                    if (usuarioModificado) {
                        return res.status(200).json({
                            ok: true,
                            message: 'Posicion actualizada.'
                        })
                    } else {
                        return res.status(401).json({
                            ok: false,
                            message: 'Error al guardar cambios.'
                        })
                    }
                }).catch(error => {
                    res.status(400).json({
                        ok: false,
                        messsage: 'No se pudo actualizar la posición.'
                    })
                });
            });
        }
    }).catch(err => {
        console.log('Error Obteniendo Documentos', err);
    });
})

app.post('/eliminarPosicion', async (req, res) => {

    const email = req.body.email;

    const usuariosRef = db.collection('usuarios');

    await usuariosRef.where('email', '==', email).get().then(snapshot => {

        if (snapshot.empty) {
            res.status(400).json({
                ok: false,
                message: 'No se encontró su usuario en la base de datos.'
            });
            return;
        } else {
            snapshot.forEach(doc => {

                // Recuperamos el usurio de la base de datos
                const usuario = doc.data();

                delete usuario['latitude'];
                delete usuario['longitude'];

                const idUserDoc = doc.id;
                // tslint:disable-next-line: no-floating-promises
                db.collection('usuarios').doc(idUserDoc).set(usuario).then(usuarioModificado => {
                    if (usuarioModificado) {
                        return res.status(200).json({
                            ok: true,
                            message: 'Su posición en el mapa fué eliminada hasta que vuelva a iniciar sesión.'
                        })
                    } else {
                        return res.status(401).json({
                            ok: false,
                            message: 'Error al eliminar su posición en el sistema de Speedy. Su posición sigue activa.'
                        })
                    }
                })
            });
        }
    }).catch(err => {
        console.log('Error, no se encntró usuario para eliminar su ubicación en el mapa de Speesdy.', err);
    });
})

app.post('/editSaldo', async (req, res) => {

    const email = req.body.email;
    const tipo = req.body.tipo;
    const nuevoSaldo = Number(req.body.nuevoSaldo);


    const usuariosRef = db.collection('usuarios');
    await usuariosRef.where('email', '==', email).get().then(async snapshotUser => {
        if (snapshotUser.empty) {
            console.log('Usuario ' + email + ' no existe en nuestra base dedatos');
            res.status(400).json({
                ok: false,
                message: 'Usuario ' + email + ' no existe en nuestra base de datos'
            });
            return
        } else {
            //recorremos el arreglo los snapshotUser
            snapshotUser.forEach(async doc => {
                const usuario = doc.data();
                if (tipo === 'MOTO') {
                    usuario.saldoMotoSpeedy = Number(usuario.saldoMotoSpeedy) + nuevoSaldo;
                }
                else if (tipo === 'CARRO') {
                    usuario.saldoCarroSpeedy = Number(usuario.saldoCarroSpeedy) + nuevoSaldo;
                }


                const idUserDoc = doc.id;  //  este es el id del documento
                const usuarioModificado = usuario;
                //Actulizamos usuario en la coleccion
                await db.collection('usuarios').doc(idUserDoc).set(usuarioModificado).then(async usuarioActualizado => {
                    console.log('Usuario ' + email + ' Saldo Actualizado Exitosamente');
                    res.status(200).json({
                        ok: true,
                        message: 'Usuario ' + email + ' Saldo Actualizado Exitosamente',
                    });

                }).catch(function (error: any) {
                    //catch de await usuario modificiado
                    console.log('USUARIO' + email + ' ERROR ', error);
                    res.status(400).json({
                        ok: false,
                        message: 'Error al IntentarActulizar Usuario ',
                    });
                    return;
                });
            });
        }

    }).catch(function (error: any) {
        //catch de await email
        console.log('Usuario ' + email + ' no existe en nuestra base de datos', error);
        res.status(200).json({
            ok: false,
            message: 'Error al registrar el usuario, este email No existe o tiene un formato incorrecto.'
        });
    })
})

app.post('/editarPosicion', async (req, res) => {

    const email = req.body.email;
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);


    const usuariosRef = db.collection('usuarios');
    await usuariosRef.where('email', '==', email).get().then(async snapshotUser => {
        if (snapshotUser.empty) {
            console.log('Usuario ' + email + ' no existe en nuestra base dedatos');
            res.status(400).json({
                ok: false,
                message: 'Usuario ' + email + ' no existe en nuestra base de datos'
            });
            return
        } else {
            //recorremos el arreglo los snapshotUser
            snapshotUser.forEach(async doc => {
                const usuario = doc.data();

                usuario.latitude = latitude;
                usuario.longitude = longitude;

                const idUserDoc = doc.id;  //  este es el id del documento

                //Actulizamos usuario en la coleccion
                await db.collection('usuarios').doc(idUserDoc).set(usuario).then(async usuarioActualizado => {
                    res.status(200).json({
                        ok: true,
                        message: 'Posicion actualizada',
                    });

                }).catch(function (error: any) {
                    //catch de await usuario modificiado
                    console.log('USUARIO' + email + ' ERROR ', error);
                    res.status(400).json({
                        ok: false,
                        message: 'Error al actualizar la posicion del usuario',
                    });
                    return;
                });
            });
        }

    }).catch(function (error: any) {
        //catch de await email
        console.log('Usuario ' + email + ' no existe en nuestra base de datos', error);
        res.status(200).json({
            ok: false,
            message: 'Error al registrar el usuario, este email No existe o tiene un formato incorrecto.'
        });
    })
})


app.post('/cambiarUsuarioTransportador', async (req, res) => {

    const email = req.body.email;
    // const cambioUsuario = JSON.parse(req.body.latitude);


    const usuariosRef = db.collection('usuarios');
    await usuariosRef.where('email', '==', email).get().then(async snapshotUser => {
        if (snapshotUser.empty) {
            console.log('Usuario ' + email + ' no existe en nuestra base dedatos');
            res.status(400).json({
                ok: false,
                message: 'Usuario ' + email + ' no existe en nuestra base de datos'
            });
            return
        } else {
            //recorremos el arreglo los snapshotUser
            snapshotUser.forEach(async doc => {
                const usuario = doc.data();

                // if(usuario.cambioUsuario == true){
                //     usuario.cambioUsuario = false
                // }else{
                //     usuario.cambioUsuario = true;
                // }

                usuario.cambioUsuario = !usuario.cambioUsuario

                const idUserDoc = doc.id;  //  este es el id del documento

                //Actulizamos usuario en la coleccion
                await db.collection('usuarios').doc(idUserDoc).set(usuario).then(async usuarioActualizado => {
                    res.status(200).json({
                        ok: true,
                        message: 'cambio actualizada',
                        usuario
                    });

                }).catch(function (error: any) {
                    //catch de await usuario modificiado
                    console.log('USUARIO' + email + ' ERROR ', error);
                    res.status(400).json({
                        ok: false,
                        message: 'Error al actualizar el cambio del usuario',
                    });
                    return;
                });
            });
        }

    }).catch(function (error: any) {
        //catch de await email
        console.log('Usuario ' + email + ' no existe en nuestra base de datos', error);
        res.status(200).json({
            ok: false,
            message: 'Error al registrar el usuario, este email No existe o tiene un formato incorrecto.'
        });
    })
})



// =====================================================================


app.post('/enviarMensajeUno', async (req, res) => {


    // RECUPERAMOS los datos que viene por post y lo guardamos en un objeto
    const email = req.body.email;
    const mensaje = req.body.mensaje;


    // VALIDAMOS QUE EL IDENTIDAD QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const usuariosRef = db.collection('usuarios');
    await usuariosRef.where('email', '==', email).get().then(async snapshot => {
        if (snapshot.empty) {
            // NO ESXISTE ESTE USURIO EN A BASE DE DATOS
            res.status(401).json({
                ok: false,
                message: 'No existe este usuario en la base de datos.'
            });

        } else {
            // EXISTE EL USUARIO EN LA BASE DE DATOS Y PROSEDEMOS A ACTUALIZAR SUS DATOS
            snapshot.forEach(doc => {
                // Recuperamos el usurio de la base de datos
                const usuario = doc.data();
                // Actualizamos el usuario de la base de datos en el local
                usuario.mensajeServidor.push({
                    id: new Date().getTime().toString(),
                    message: mensaje,
                    visto: false
                });

                const idUserDoc = doc.id;  //  este es el id del documento
                const usuarioModificado = usuario;
                db.collection('usuarios').doc(idUserDoc).set(usuarioModificado).then(usuarioActualizado => {
                    if (usuarioActualizado) {
                        res.status(200).json({
                            ok: true,
                            messaje: 'Notificacion Enviada Exitosamente',
                        });
                        return;
                    }
                }, error => {
                    return res.status(401).json({
                        ok: false,
                        messaje: 'Error al intentar enviar notificacion a el usuario',
                        error
                    });
                })
            });
        }
    })
})

app.post('/enviarMensajeTodos', async (req, res) => {

    // RECUPERAMOS los datos que viene por post y lo guardamos en un objeto
    const mensaje = req.body.mensaje;
    console.log(mensaje);

    const usuarioRef = db.collection('usuarios');
    const docsSnapshot = await usuarioRef.get();

    const usuarios = docsSnapshot.docs.map(doc => doc.data());
    if (usuarios) {
        for (const i in usuarios) {
            await usuarioRef.where('identificacion', '==', usuarios[i].identificacion).get().then(async snapshot => {
                snapshot.forEach(doc => {
                    const idUserDoc = doc.id;  //  este es el id del documento
                    console.log(i);
                    usuarios[i].mensajeServidor.push({
                        id: new Date().getTime().toString(),
                        message: mensaje,
                        visto: false
                    });
                    //  console.log('SI EXISTE');
                    //  console.log(usuarios);
                    //  return;
                    // tslint:disable-next-line:no-empty
                    // tslint:disable-next-line: no-floating-promises
                    db.collection('usuarios').doc(idUserDoc).set(usuarios[i]).then(usuarioActualizado => {
                        console.log(usuarioActualizado);
                        res.status(200).json({
                            ok: false,
                            mensaje: 'Mensaje Enviado con Exito'
                        })
                        return;
                    })
                })
            })
        }
        res.status(400).json({
            ok: false,
            message: 'Error al buscar usuario',

        })
        return;
    } else {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al buscar email'
        })
        return;
    }

})



// ESTE SE USÓ SOLO PARA CREARLE EL CAMPO A TODOS
app.get('/crearCampoComision', async (req, res) => {
    const usuarioRef = db.collection('usuarios');
    const docsSnapshot = await usuarioRef.get();
    let ahora = moment(Number(new Date().getTime().toString())).format('DD/MM/YYYY HH:mm');

    let usuarios = docsSnapshot.docs.map(doc => doc.data());
    if (usuarios) {
        for (let i in usuarios) {
            await usuarioRef.where('email', '==', usuarios[i].email).get().then(async snapshot => {
                snapshot.forEach(doc => {
                    const idUserDoc = doc.id;
                    // delete usuarios[i].pagoComisiones;
                    usuarios[i].pagoComisiones = [];
                    // usuarios[i].habilitadoComision = JSON.parse('false');
                    usuarios[i].mensajeServidor = [];
                    // usuarios[i].mensajeServidor = [{
                    //     id:  new Date().getTime().toString(),
                    //     message: 'Prueba Speedy',
                    //     visto: false
                    // }];


                    // tslint:disable-next-line: no-floating-promises
                    db.collection('usuarios').doc(idUserDoc).set(usuarios[i]).then(usuarioActualizado => {
                        if (usuarioActualizado) {
                            console.log('Bien: ', i);
                        } else {
                            console.error('Mal: ', i);
                        }
                    })
                })
            })
        }
        res.status(200).json({
            ok: true,
            message: 'Terminó el proceso de habilitar por comisión.',
            ahora
        })
        return;
    } else {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al buscar los usuarios',
            ahora //preguntar a david si es necesario devolver el objeto ahora aunque exista error
        })
        return;
    }

})


app.get('/deshabilitarComisionFalse', async (req, res) => {
    const usuarioRef = db.collection('usuarios');
    const docsSnapshot = await usuarioRef.get();

    let usuarios = docsSnapshot.docs.map(doc => doc.data());
    if (usuarios) {
        for (let i in usuarios) {
            await usuarioRef.where('email', '==', usuarios[i].email).get().then(async snapshot => {
                // tslint:disable-next-line: no-void-expression
                snapshot.forEach(doc => {
                    const idUserDoc = doc.id;
                    let user = doc.data();
                    user.habilitadoComision = JSON.parse('false');
                    // tslint:disable-next-line: no-floating-promises
                    db.collection('usuarios').doc(idUserDoc).set(user).then(usuarioActualizado => {
                        if (usuarioActualizado) {
                            console.log('Bien: ', i);
                        }
                        else {
                            console.error('Mal: ', i);
                        }
                    });
                })
            })
        }
        res.status(200).json({
            ok: true,
            message: 'Terminó el proceso de deshabilitado por comisión.',

        })
        return;
    } else {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al buscar los usuarios'
        })
        return;
    }

})



app.post('/pagoIndividualComision', async (req, res) => {

    const email = req.body.email;
    const comision = Number(req.body.comision);
    const fecha = req.body.fecha;
    const tipo = req.body.tipo;

    const pagoComisiones = {
        id: new Date().getTime().toString(),
        email,
        comision,
        fecha,
        tipo
    }


    const usuarioRef = db.collection('usuarios')
    await usuarioRef.where('email', '==', email).get().then(async snapshot => {
        if (snapshot.empty) {
            res.status(400).json({
                ok: false,
                message: 'No se encontró este usuario en al abase de datos.'
            });
            return;
        }
        snapshot.forEach(doc => {
            const idUserDoc = doc.id;
            let usuario = doc.data();
            usuario.pagoComisiones.push(pagoComisiones);
            usuario.habilitadoComision = JSON.parse('true');

            // tslint:disable-next-line: no-floating-promises
            db.collection('usuarios').doc(idUserDoc).set(usuario).then(usuarioActualizado => {
                if (usuarioActualizado) {
                    res.status(200).json({
                        ok: true,
                        message: 'Pago de la comisión efectuado correctamente.'
                    });
                    return;
                } else {
                    res.status(400).json({
                        ok: false,
                        message: 'Error al subir la comisión.'
                    });
                    return;
                }
            })
        })
    })
    res.status(200).json({
        ok: true,
        message: 'Terminado',

    })
    return;


})



app.post('/totalComision', async (req, res) => {

    let arraySolicitudes: any[] = [];
    const email = req.body.email;


    const solicitudesRef = db.collection('solicitudes');
    const docsSnapshot = await solicitudesRef.get();

    const solicitudes = docsSnapshot.docs.map(doc => doc.data());


    for (let solicitud of solicitudes) {
        if (solicitud.emailTransportador === email && solicitud.estado === 'TERMINADA') {
            let newSolicitud = {
                valorFinal: solicitud.valorFinal,
                tipo: solicitud.tipo,
                municipio: solicitud.municipio,
                descripcion: solicitud.descripcion,
                descripcionOrigen: solicitud.descripcionOrigen,
                descripcionDestino: solicitud.descripcionDestino,
                fechaCreacion: solicitud.fechaCreacion,
                fechaActualizacion: solicitud.fechaActualizacion,
                emailPasajero: solicitud.emailPasajero
            }
            arraySolicitudes.push(newSolicitud);
        }
    }

    res.status(200).json({
        ok: true,
        arraySolicitudes
    });
    return;
})



app.post('/verUsuariosDebajo', async (req, res) => {
    const codigo = req.body.codigo;

    const usuarioRef = db.collection('usuarios');
    const docsSnapshot = await usuarioRef.get();
    let asociados: any[] = []

    let usuarios = docsSnapshot.docs.map(doc => doc.data());
    if (usuarios) {
        for (let i in usuarios) {

            if (usuarios[i].codigo1 === codigo) {
                asociados.push(usuarios[i]);
            }
        }
        res.status(200).json({
            ok: true,
            asociados

        })
        return;
    } else {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al buscar los usuarios por debajo'
        })
        return;
    }
})


app.post('/verUsuariosArriba', async (req, res) => {
    const codigo = req.body.codigo;

    const usuarioRef = db.collection('usuarios');
    const docsSnapshot = await usuarioRef.get();
    let asociados: any[] = [];

    let usuarios = docsSnapshot.docs.map(doc => doc.data());
    if (usuarios) {
        for (let i in usuarios) {

            if (usuarios[i].codigoLider === codigo) {
                asociados.push(usuarios[i]);
            }
        }
        res.status(200).json({
            ok: true,
            message: 'Terminó el proceso de ver usuario arriba de un lider',
            asociados

        })
        return;
    } else {
        res.status(400).json({
            ok: false,
            mensaje: 'Error al buscar los usuarios por arriba'
        })
        return;
    }
})



app.post('/transferirAsociado', async (req, res) => {
    const emailOrigen = req.body.emailOrigen;
    const emailDestino = req.body.emailDestino;
    const email = req.body.email;

    const usuarioRef = db.collection('usuarios')
    await usuarioRef.where('email', '==', emailOrigen).get().then(async snapshot1 => {
        if (snapshot1.empty) {
            res.status(400).json({
                ok: false,
                message: 'No se encontró este lider de origen.'
            });
            return;
        } else {
            snapshot1.forEach(async doc => {
                await usuarioRef.where('email', '==', emailDestino).get().then(async snapshot2 => {
                    if (snapshot2.empty) {
                        res.status(400).json({
                            ok: false,
                            message: 'No se encontró este lider destino.'
                        });
                        return;
                    } else {
                        snapshot2.forEach(async doc2 => {
                            // const idUserDoc = doc2.id;  
                            let usuario = doc2.data();
                            await usuarioRef.where('email', '==', email).get().then(async snapshot3 => {
                                if (snapshot3.empty) {
                                    res.status(400).json({
                                        ok: false,
                                        message: 'No se encontró este usuario.'
                                    });
                                    return;
                                } else {
                                    snapshot2.forEach(async doc3 => {
                                        const idUserDoc2 = doc3.id;
                                        let usuario2 = doc3.data();
                                        usuario2.codigo1 = usuario.codigoLider;


                                        // tslint:disable-next-line: no-floating-promises
                                        db.collection('usuarios').doc(idUserDoc2).set(usuario2).then(usuarioActualizado => {
                                            if (usuarioActualizado) {
                                                res.status(200).json({
                                                    ok: true,
                                                    message: 'Pago de la comisión efectuado correctamente.'
                                                });
                                                return;
                                            } else {
                                                res.status(400).json({
                                                    ok: false,
                                                    message: 'Error al tranferir usuario.'
                                                });
                                                return;
                                            }
                                        })
                                    })
                                }

                            })
                        })

                    }

                })
            })
        }
    })
})

app.get('/sumatoriaComision', async (req, res) => {

    let saldoActual: number = 0;
    let saldoAcumulado: number = 0;
    let contadorUsuarios: number = 0;


    const usuarioRef = db.collection('usuarios')
    await usuarioRef.get().then(async snapshot => {
        if (snapshot.empty) {
            res.status(400).json({
                ok: false,
                message: 'No se encontró este usuarios para calcular comisiones.'
            });
            return;
        }
        snapshot.forEach(doc => {
            let usuario = doc.data();
            contadorUsuarios++;
            saldoActual = usuario.saldoMotoSpeedy;
            console.log('saldo actual-1', saldoActual);
            saldoAcumulado = Number(saldoAcumulado) + Number(saldoActual);
            console.log('saldo acumulado', saldoAcumulado);
            // usuario.saldoMotoSpeedy = Number(usuario.saldoMotoSpeedy) + nuevoSaldo;
            saldoActual = 0;
            console.log('nuevo saldo actual-2', saldoActual);


        })
    })
    res.status(200).json({
        ok: true,
        saldoAcumulado: saldoAcumulado,
        contadorUsuarios: contadorUsuarios,

    })
    return;


})


module.exports = app;  
