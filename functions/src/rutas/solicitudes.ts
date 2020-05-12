import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.post('/crearSolicitud', async (req, res) => {


    const idSolicitud = Number(new Date().getTime().toString());
    const emailPasajero = req.body.emailPasajero;
    const tipo = req.body.tipo;
    const descripcionOrigen = req.body.descripcionOrigen;
    const descripcionDestino = req.body.descripcionDestino;
    const nombrePasajero = req.body.nombrePasajero;
    const nombreTransportador = req.body.nombreTransportador || '';
    const descripcion = req.body.descripcion;
    const oferta = Number(req.body.oferta);
    const municipio = req.body.municipio;
    const demanda = Number(req.body.demanda);
    const estado = 'PENDIENTE';
    const alto = req.body.alto || 0;
    const largo = req.body.largo || 0;
    const ancho = req.body.ancho || 0;
    const peso = req.body.peso || 0;
    const distancia = req.body.distancia;
    const codigo = req.body.codigo;
    const posicionOrigenLat = req.body.posicionOrigenLat;
    const posicionOrigenLon = req.body.posicionOrigenLon;
    const posicionDestinoLat = req.body.posicionDestinoLat;
    const posicionDestinoLon = req.body.posicionDestinoLon;
    const avatarPasajero = req.body.avatarPasajero;
    const avatarTransportador = req.body.avatarTransportador || '';
    const fechaCreacion = new Date().getTime().toString();
    const fechaActualizacion = new Date().getTime().toString();
    const preAceptados: any[] = [];
    const valorFinal = 0;



    const usuariosRef = db.collection('usuarios');
    // tslint:disable-next-line: no-floating-promises
    usuariosRef.where('email', '==', emailPasajero).get().then(async snapshotEmail => {
        if (snapshotEmail.empty) {
            // NO EXISTE ESTE USURIO EN A BASE DE DATOS
            console.log('Usuario ' + emailPasajero + ' no existe en nuestra base de datos 001');
            res.status(401).json({
                ok: false,
                message: 'No existe ' + emailPasajero + ' en la base de datos ',
            });
            return
        } else {
            const solicitudForm = {
                idSolicitud,
                emailPasajero,
                tipo,
                descripcionOrigen,
                descripcionDestino,
                nombrePasajero,
                nombreTransportador,
                descripcion,
                oferta,
                municipio,
                demanda,
                estado,
                peso,
                alto,
                largo,
                ancho,
                distancia,
                codigo,
                posicionOrigenLat,
                posicionOrigenLon,
                posicionDestinoLat,
                posicionDestinoLon,
                avatarPasajero,
                avatarTransportador,
                fechaCreacion,
                fechaActualizacion,
                preAceptados,
                valorFinal,
            }
            // CREAMOS LA SOLICITUD E LA BASE DE DATOS
            await db.collection('solicitudes').add(solicitudForm).then(ref => {
                if (ref) {
                    return res.status(200).json({
                        ok: true,
                        message: 'Solicitud Creada Exitosamente'
                    });
                } else {
                    res.status(200).json({
                        body: solicitudForm
                    })
                    return res.status(400).json({
                        ok: false,
                        message: 'Error al crear al solicitar'
                    });
                }
            })
            // .catch(function (error: any) {
            //     //catch de await usuario modificiado
            //     console.log('USUARIO ERROR 003 ', error);
            //     res.status(400).json({
            //         ok: false,
            //         message: 'Error al realizar la solicitud',
            //     });
            //     return;
            // });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('USUARIO ERROR 004 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'Problemas temporales de red, intenta de nuevo',
    //     });
    //     return;
    // });
})

app.post('/modificarOferta', async (req, res) => {

    const idSolicitud = req.body.idSolicitud;
    const oferta = Number(req.body.oferta);
    const emailPasajero = req.body.emailPasajero;



    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudRef = db.collection('solicitudes');
    const usuariosRef = db.collection('usuarios');
    await solicitudRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotIdSolicitud => {
        if (snapshotIdSolicitud.empty) {
            res.status(401).json({
                ok: false,
                message: 'No existe La solicitud, actualice la página',
            });
            return
        } else {
            snapshotIdSolicitud.forEach(async doc => {
                const solicitud = doc.data();
                if (oferta === solicitud.oferta) {
                    res.status(401).json({
                        ok: false,
                        message: 'Ha ingresado la misma oferta, Debe hacer una oferta diferente a la actual.',
                    });
                    return;
                } else {
                    await usuariosRef.where('email', '==', emailPasajero).get().then(async snapshotUser => {
                        if (snapshotUser.empty) {
                            res.status(401).json({
                                ok: false,
                                message: 'No tiene permisos para actualizar la solicitud.',
                            });
                            return
                        } else {
                            solicitud.oferta = oferta;
                            solicitud.fechaActualizacion = new Date().getTime().toString();
                            await db.collection('solicitudes').doc(doc.id).set(solicitud).then(async solicitudActualizada => {
                                if (solicitudActualizada) {
                                    res.status(200).json({
                                        ok: true,
                                    });
                                    return;
                                } else {
                                    res.status(401).json({
                                        ok: false,
                                        message: 'Error al modificar la oferta, intente nuevamente.',
                                    });
                                    return;
                                }
                            });
                        }
                    })

                }
            })

        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('ID NO EXISTE 003 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'SOLICITUD NO EXISTE',
    //     });
    // });


});

app.post('/preAceptarSolicitud', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTransportador = req.body.emailTransportador;
    const nombreTransportador = req.body.nombreTransportador;
    const demandaTransportador = Number(req.body.demandaTransportador);
    const avatarTransportador = req.body.avatarTransportador;
    const motoOcupada = JSON.parse(req.body.motoOcupada);
    const carroOcupado = JSON.parse(req.body.carroOcupado);

    // validar que xista la id solictud y crar el objeto y returnarlo


    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudRef = db.collection('solicitudes');
    await solicitudRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotId => {
        if (snapshotId.empty) {
            // NO EXISTE ESTE USURIO EN A BASE DE DATOS
            console.log('No Existe Solicitud' + idSolicitud);
            res.status(401).json({
                ok: false,
                message: 'No existe' + idSolicitud,
            });
            return
        } else {
            snapshotId.forEach(async doc => {
                const solicitud = await doc.data();
                if (solicitud.estado === 'ACEPTADA' || solicitud.estado === 'ELIMINADA') {
                    res.status(400).json({
                        ok: false,
                        message: 'Esta solicitud no está disponible'
                    })
                    return;
                }
                //algunas pruebas el avatar viene vacio
                if (solicitud.avatarTransportador === ' ') {
                    res.status(400).json({
                        ok: false,
                        message: 'Perfil sin avatar, Favor complete perfil'
                    })
                    return;
                }

                const solicitudPreaceptar = {
                    idSolicitud,
                    emailTransportador,
                    nombreTransportador,
                    demandaTransportador,
                    avatarTransportador,
                    motoOcupada,
                    carroOcupado
                }

                //validar saldo de transportador
                const transportadorRef = db.collection('usuarios');
                await transportadorRef.where('email', '==', emailTransportador).get().then(async snapshotTransportador1 => {
                    if (snapshotTransportador1.empty) {
                        // NO EXISTE ESTE USURIO EN A BASE DE DATOS
                        console.log('No Existe transportador');
                        res.status(401).json({
                            ok: false,
                            message: 'No existe transportador' + emailTransportador
                        });
                        return
                    }
                    else {
                        snapshotTransportador1.forEach(async doc1 => {
                            const transportador = await doc1.data();
                            if ((solicitud.tipo === 'MOTOCARRERA') || (solicitud.tipo === 'MOTOMENSAJERIA')) {
                                if (transportador.saldoMotoSpeedy < 800) {
                                    res.status(401).json({
                                        ok: false,
                                        message: 'Saldo MotoSpeedy Insuficiente, Su Saldo Actual: $' + transportador.saldoMotoSpeedy
                                    });

                                }
                            }
                            if ((solicitud.tipo === 'CARROCARRERA') || (solicitud.tipo === 'CARROMENSAJERIA')) {
                                if (transportador.saldoMotoCarroSpeedy < 800) {
                                    res.status(401).json({
                                        ok: false,
                                        message: 'Saldo CarroSpeedy Insuficiente, Su Saldo Actual: $' + transportador.saldoMotoCarroSpeedy
                                    });

                                }
                            }


                            //fin de validar saldotransportador

                            solicitud.preAceptados.push(solicitudPreaceptar);
                            await db.collection('solicitudes').doc(doc.id).set(solicitud).then(async solicitudActualizada => {
                                if (solicitudActualizada) {
                                    res.status(200).json({
                                        ok: true,
                                        message: 'Ha preaceptado la solicitud.'
                                    });
                                    return;
                                } else {
                                    await res.status(400).json({
                                        ok: false,
                                        message: 'Error la preaceptar la solicitud.'
                                    });
                                    return;
                                }
                            });

                        });

                    }
                })
                // .catch(function (error: any) {
                //     //catch de await usuario modificiado
                //     console.log('ID NO EXISTE 006 ', error);
                //     res.status(400).json({
                //         ok: false,
                //         message: 'SOLICITUD NO EXISTE 006',
                //     });
                // });


            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('ID NO EXISTE 007 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'SOLICITUD NO EXISTE',
    //     });
    // });
})


app.post('/eliminarPresolicitud', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTransportador = req.body.emailTransportador;


    // validar que xista la id solictud y crar el objeto y returnarlo


    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudRef = db.collection('solicitudes');
    await solicitudRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotId => {
        if (snapshotId.empty) {
            // NO EXISTE ESTE USURIO EN A BASE DE DATOS
            console.log('No Existe Solicitud' + idSolicitud);
            res.status(401).json({
                ok: false,
                message: 'No existe la solicitud.',
            });
            return
        } else {
            let validar = false;
            snapshotId.forEach(async doc => {
                let solicitud = await doc.data();

                for (let pre of solicitud.preAceptados) {
                    if (pre.idSolicitud == idSolicitud && pre.emailTransportador == emailTransportador) {
                        validar = true;
                        let i = solicitud.preAceptados.indexOf(pre);
                        solicitud.preAceptados.splice(i, 1);
                        break;
                    }
                }

                if (validar == false) {
                    res.status(400).json({
                        ok: false,
                        message: 'No se encontró transportador asociado la solicitud.'
                    });
                    return;
                } else {
                    await db.collection('solicitudes').doc(doc.id).set(solicitud).then(async solicitudActualizada => {
                        if (solicitudActualizada) {
                            res.status(200).json({
                                ok: true,
                                message: 'Has desaceptado la solicitud.'
                            });
                            return;
                        } else {
                            await res.status(400).json({
                                ok: false,
                                message: 'Error al salir de la preaceptación.'
                            });
                            return;
                        }
                    })
                }
            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('ID NO EXISTE 007 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'SOLICITUD NO EXISTE 007',
    //     });
    // });
})


// ============== LISTA LAS SOLICITUDES 
app.get('/getSolicitudes', async (req, res) => {

    const usuariosRef = await db.collection('solicitudes');
    const docsSnapshot = await usuariosRef.get();
    const solicitudes = docsSnapshot.docs.map(doc => doc.data());
    if (solicitudes) {
        return res.status(200).json({
            ok: true,
            solicitudes
        });
    } else {
        return res.status(400).json({
            ok: false,
            message: 'No se pudieron obtener las Solicitudes'
        })
    }
})

// ============== LISTA LAS SOLICITUDES ELIMINADAS
app.get('/getSolicitudesEliminadas', async (req, res) => {

    const solicitudesEliminadas: any[] = [];

    // solicitud.preAceptados.push(listaSolicitudes);
    const solicitudesRef = await db.collection('solicitudes');
    await solicitudesRef.get().then(async snapshot => {
        if (snapshot.empty) {
            // NO ESXISTE ESTA SOLICITUD EN A BASE DE DATOS
            console.log('No Existe Id en la Base de Datos 001');
            await res.status(401).json({
                ok: false,
                message: 'No existen solicitudes en la base de datos.'
            });
            return;
        } else {
            snapshot.forEach(async doc => {
                const solicitud = await doc.data();
                if ((solicitud.estado === 'ELIMINADA')) {
                    console.log('Esta SI');
                    solicitudesEliminadas.push(solicitud);
                }
            })
            res.status(200).json({
                ok: true,
                solicitudesEliminadas: solicitudesEliminadas,
            });
        }

    }).catch(function (error: any) {
        console.log('Error, al lista las solicitudes', error);
        res.status(400).json({
            ok: false,
            message: 'Error, al lista las solicitudes',
        });
        return;
    });
})



// ============== ACEPTAR SOLICITUDES 
app.post('/aceptarSolicitud', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTransportador = req.body.emailTransportador;
    const avatarTransportador = req.body.avatarTransportador;
    const nombreTransportador = req.body.nombreTransportador;
    const demanda = Number(req.body.demanda);
    const motoOcupada = JSON.parse(req.body.motoOcupada);
    const carroOcupado = JSON.parse(req.body.carroOcupado);

    if (motoOcupada === true || carroOcupado === true) {
        res.status(400).json({
            ok: false,
            message: 'Este transportador ya no esta disponible'
        });
        return;
    }



    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudesRef = db.collection('solicitudes');
    await solicitudesRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshot => {
        if (snapshot.empty) {
            // NO ESXISTE ESTA SOLICITUD EN A BASE DE DATOS
            console.log('No Existe Id en la Base de Datos 001');
            res.status(401).json({
                ok: false,
                message: 'No existe esta solicitud en la base de datos.'
            });
            return;
        } else {
            snapshot.forEach(async doc => {
                const solicitud = await doc.data();
                if ((solicitud.estado === 'ACEPTADA' || solicitud.estado === 'ELIMINADA')) {
                    res.status(401).json({
                        ok: false,
                        message: 'No es posible aceptar la solicitud que ya ha sido aceptada por otro o ha sido eliminada.'
                    });
                    return;
                } else if (solicitud.estado === 'PENDIENTE') {


                    solicitud.estado = 'ACEPTADA';
                    solicitud.nombreTransportador = nombreTransportador;
                    solicitud.avatarTransportador = avatarTransportador;
                    solicitud.fechaActualizacion = new Date().getTime().toString();
                    solicitud.valorFinal = demanda;
                    solicitud.emailTransportador = emailTransportador;
                    solicitud.preAceptados = [];
                    const idsolicitud = doc.id;  //  este es el id del documento


                    await db.collection('solicitudes').doc(idsolicitud).set(solicitud).then(async solicitudActualizada => {
                        if (solicitudActualizada) {
                            // AQUI LE ENVIAMOS UN MENSAJE AL USUARIO
                            const usuariosRef = await db.collection('usuarios');
                            // NOTIFICAMOS AL USUARIO QUE SU SOLICITUD FUE ACEPTADA  ===========================
                            await usuariosRef.where('email', '==', emailTransportador).get().then(async snapshotTrans => {
                                if (snapshotTrans.empty) {
                                    // NO EXISTE ESTE USUARIO EN LA BASE DE DATOS
                                    res.status(401).json({
                                        ok: false,
                                        message: 'No existe este transportador en la base de datos.'
                                    });
                                    return;
                                } else {
                                    // Cambios los camos de usuario
                                    snapshotTrans.forEach(async doc2 => {
                                        // Recuperamos el usurio de la base de datos
                                        let transportador = await doc2.data();
                                        const transId = doc2.id;
                                        if ((solicitud.tipo === 'MOTOCARRERA') || (solicitud.tipo === 'MOTOMENSAJERIA')) {
                                            transportador.motoOcupada = true;
                                        }
                                        else if ((solicitud.tipo === 'CARROCARRERA') || (solicitud.tipo === 'CARROMENSAJERIA')) {
                                            transportador.carroOcupado = true;
                                        }
                                        transportador.mensajeServidor.push({
                                            id: new Date().getTime().toString(),
                                            message: 'Tienes una solicutud aceptada, revise el listado de solicitudes aceptadas.',
                                            visto: false
                                        });

                                        //inicio await transportador
                                        await db.collection('usuarios').doc(transId).set(transportador).then(async transActualizada => {
                                            if (transActualizada) {
                                                res.status(200).json({
                                                    ok: true,
                                                    message: 'Transportador Actualizado.'
                                                });
                                                return;
                                            }
                                            else {
                                                res.status(401).json({
                                                    ok: false,
                                                    message: 'Fallo al Actulizar transportador'
                                                });
                                                return;
                                            }
                                            //catch de away transportador
                                        })
                                        // .catch(function (error: any) {
                                        //     //catch de await usuario modificiado
                                        //     console.log('Error, al actulizar transportador 002 ', error);
                                        //     res.status(400).json({
                                        //         ok: false,
                                        //         message: 'Error, al actualizar transportador',
                                        //     });
                                        //     return;
                                        // });
                                    })
                                }

                            })
                            // .catch(function (error: any) {
                            //     //catch de await usuario modificiado
                            //     console.log('Error, al buscar transportador 003 ', error);
                            //     res.status(400).json({
                            //         ok: false,
                            //         message: 'Error, al buscar transportador',
                            //     });
                            // });

                        } else {
                            res.status(200).json({
                                ok: false,
                                message: 'Error al tomar la solicitud CarroSpeedy'
                            })
                            return;
                        }
                    }, error => {
                        return res.status(401).json({
                            ok: false,
                            messaje: 'Error al actualizar la solicitud CarroSpeedy',
                            error
                        });
                    })
                }
            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('Error, al buscar solicitud  003 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'Error, al buscar solicitud',
    //     });
    // });
})

app.post('/aceptarSolicitudWeb', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTransportador = req.body.emailTransportador;
    const avatarTransportador = req.body.avatarTransportador;
    const nombreTransportador = req.body.nombreTransportador;
    const demanda = Number(req.body.demanda);
    const motoOcupada = JSON.parse(req.body.motoOcupada);
    const carroOcupado = JSON.parse(req.body.carroOcupado);

    if (motoOcupada === true || carroOcupado === true) {
        res.status(400).json({
            ok: false,
            message: 'Este transportador esta ocupado o no esta disponible'
        });
        return;
    }



    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudesRef = db.collection('solicitudesEliminadas');
    await solicitudesRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshot => {
        if (snapshot.empty) {
            // NO ESXISTE ESTA SOLICITUD EN A BASE DE DATOS
            console.log('No Existe Id en la Base de Datos 001');
            res.status(401).json({
                ok: false,
                message: 'No existe esta solicitud en la base de datos.'
            });
            return;
        } else {
            snapshot.forEach(async doc => {

                const solicitud = await doc.data();
                if ((solicitud.estado === 'ACEPTADA')) {
                    res.status(401).json({
                        ok: false,
                        message: 'No es posible RE-ASIGNAR la solicitud que ya ha sido aceptada por otro transportador.'
                    });
                    return;
                } else if (solicitud.estado === 'ELIMINADA') {


                    solicitud.estado = 'ACEPTADA';
                    solicitud.nombreTransportador = nombreTransportador;
                    solicitud.avatarTransportador = avatarTransportador;
                    solicitud.fechaActualizacion = new Date().getTime().toString();
                    solicitud.valorFinal = demanda;
                    solicitud.emailTransportador = emailTransportador;
                    solicitud.preAceptados = [];
                    const idsolicitud = doc.id;  //  este es el id del documento


                    await db.collection('solicitudes').doc(idsolicitud).set(solicitud).then(async solicitudActualizada => {
                        if (solicitudActualizada) {
                            // AQUI LE ENVIAMOS UN MENSAJE AL USUARIO
                            const usuariosRef = db.collection('usuarios');
                            // NOTIFICAMOS AL USUARIO QUE SU SOLICITUD FUE ACEPTADA  ===========================
                            await usuariosRef.where('email', '==', emailTransportador).get().then(async snapshotTrans => {
                                if (snapshotTrans.empty) {
                                    // NO EXISTE ESTE USUARIO EN LA BASE DE DATOS
                                    res.status(401).json({
                                        ok: false,
                                        message: 'No existe este transportador en la base de datos.'
                                    });
                                    return;
                                } else {
                                    // Cambios los camos de usuario
                                    snapshotTrans.forEach(async doc2 => {
                                        // Recuperamos el usurio de la base de datos
                                        let transportador = await doc2.data();
                                        const transId = doc2.id;
                                        if ((solicitud.tipo === 'MOTOCARRERA') || (solicitud.tipo === 'MOTOMENSAJERIA')) {
                                            if (transportador.saldoMotoSpeedy < 800) {
                                                res.status(401).json({
                                                    ok: false,
                                                    message: 'Saldo MotoSpeedy Insuficiente, Su Saldo Actual: $' + transportador.saldoMotoSpeedy
                                                });
                                            }
                                            transportador.motoOcupada = true;

                                        }
                                        else if ((solicitud.tipo === 'CARROCARRERA') || (solicitud.tipo === 'CARROMENSAJERIA')) {
                                            if (transportador.saldoMotoCarroSpeedy < 800) {
                                                res.status(401).json({
                                                    ok: false,
                                                    message: 'Saldo CarroSpeedy Insuficiente, Su Saldo Actual: $' + transportador.saldoMotoSpeedy
                                                });
                                            }
                                            transportador.carroOcupado = true;
                                        }
                                        transportador.mensajeServidor.push({
                                            id: new Date().getTime().toString(),
                                            message: 'Tienes una solicutud aceptada, revise el listado de solicitudes aceptadas 004.',
                                            visto: false
                                        });

                                        //inicio await transportador
                                        await db.collection('usuarios').doc(transId).set(transportador).then(async transActualizada => {
                                            if (transActualizada) {
                                                res.status(200).json({
                                                    ok: true,
                                                    message: 'Solicitud Recuperada y aceptada'
                                                });
                                                return;
                                            }
                                            else {
                                                res.status(401).json({
                                                    ok: false,
                                                    message: 'Fallo al Actualizar transportador'
                                                });
                                                return;
                                            }
                                            //catch de away transportador
                                        })

                                    })
                                }

                            })
                            // .catch(function (error: any) {
                            //     //catch de await usuario modificiado
                            //     console.log('Error, al buscar transportador 003 ', error);
                            //     res.status(400).json({
                            //         ok: false,
                            //         message: 'Error, al buscar transportador',
                            //     });
                            // });

                        } else {
                            res.status(200).json({
                                ok: false,
                                message: 'Error al tomar la solicitud CarroSpeedy'
                            })
                            return;
                        }
                    }, error => {
                        return res.status(401).json({
                            ok: false,
                            messaje: 'Error al actualizar la solicitud CarroSpeedy',
                            error
                        });
                    })
                }
            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('Error, al buscar solicitud  003 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'Error, al buscar solicitud',
    //     });
    // });
})


app.post('/modificarDemanda', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTransportador = req.body.emailTransportador;
    const demandaTransportador = Number(req.body.demandaTransportador);


    // validar que xista la id solictud y crar el objeto y returnarlo


    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudRef = db.collection('solicitudes');
    await solicitudRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotId => {
        if (snapshotId.empty) {
            // NO EXISTE ESTE USURIO EN A BASE DE DATOS
            console.log('No Existe Solicitud' + idSolicitud);
            res.status(401).json({
                ok: false,
                message: 'No existe ' + idSolicitud,
            });
            return
        } else {
            snapshotId.forEach(async doc => {
                let solicitud = await doc.data();
                if ((solicitud.estado === 'ACEPTADA' || solicitud.estado === 'ELIMINADA')) {
                    res.status(401).json({
                        ok: false,
                        message: 'La solicitud ya no está disponible.',
                    });
                    return
                } else {
                    for (let pre of solicitud.preAceptados) {
                        if (pre.emailTransportador === emailTransportador) {
                            pre.demandaTransportador = demandaTransportador;
                            break;
                        }
                    }

                    await db.collection('solicitudes').doc(doc.id).set(solicitud).then(async solicitudActualizada => {
                        if (solicitudActualizada) {
                            await res.status(200).json({
                                ok: true,
                                message: 'Ha preaceptado la solicitud.'
                            });
                            return;
                        } else {
                            await res.status(400).json({
                                ok: false,
                                message: 'Error la preaceptar la solicitud.'
                            });
                            return;
                        }
                    })
                }

            })

        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('ID NO EXISTE 003 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'SOLICITUD NO EXISTE 003',
    //     });
    // });


});




app.post('/eliminarSolicitud', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailPasajero = req.body.emailPasajero;


    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudessRef = db.collection('solicitudes');
    await solicitudessRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotSolicitud => {
        if (snapshotSolicitud.empty) {
            res.status(401).json({
                ok: false,
                message: 'No existe la solicitud.'
            });
            return
        } else {
            snapshotSolicitud.forEach(async doc => {
                let solicitud = await doc.data();

                if (solicitud.estado !== 'PENDIENTE') {
                    res.status(400).json({
                        ok: false,
                        message: 'La solicitud no se puede eliminar en el estado en que se encuentra, debe cancelarla y dejarla en estado "PENDIENTE". '
                    });
                    return;
                } else {
                    solicitud.estado = 'ELIMINADA';
                    solicitud.fechaActualizacion = new Date().getTime().toString();

                    await db.collection('solicitudes').doc(doc.id).set(solicitud).then(async solicitudActualizada => {
                        if (solicitudActualizada) {
                            if (solicitud.emailPasajero === emailPasajero) {
                                // db.collection('solicitudes').doc(doc.id).delete().then(solicitudEliminada => {
                                //     console.log(solicitudEliminada);
                                // }).then(data => {

                                // tslint:disable-next-line: no-floating-promises
                                db.collection('solicitudesEliminadas').add({
                                    solicitud
                                }).then(addSolicitudEliminada => {
                                    console.log(addSolicitudEliminada);
                                    res.status(200).json({
                                        ok: true,
                                        message: 'La solicitud se ha eliminado exitosamente.'
                                    });
                                    return;
                                })
                                // .catch(() => {
                                //     res.status(400).json({
                                //         ok: false,
                                //         message: 'La solicitud se ha eliminado sin copias.'
                                //     });
                                //     return;
                                // })
                                // }).catch(() => {
                                //     res.status(400).json({
                                //         ok: false,
                                //         message: 'Error al eliminar la solicitud.'
                                //     });
                                //     return;
                                // })
                            } else {
                                res.status(400).json({
                                    ok: false,
                                    message: 'No tiene permisos para eliminar la solicitud.'
                                });
                                return;
                            }
                        } else {
                            res.status(400).json({
                                ok: false,
                                message: 'Error en el proceso'
                            });
                            return;
                        }
                    })
                }
            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     res.status(400).json({
    //         ok: false,
    //         message: 'No existe la solicitud',
    //     });
    // });


});

app.post('/solicitudDesierta', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);


    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudesEliminadasRef = db.collection('solicitudesEliminadas');
    await solicitudesEliminadasRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotSolicitudE => {
        if (snapshotSolicitudE.empty) {
            res.status(401).json({
                ok: false,
                message: 'No existe la solicitud a operar.'
            });
            return
        } else {
            snapshotSolicitudE.forEach(async doc => {
                let solicitudE = await doc.data();
                if (solicitudE.estado !== 'ELIMINADA') {
                    res.status(400).json({
                        ok: false,
                        message: 'La solicitud no se puede operar en el estado en que se encuentra, debe estar en estado "ELIMINADA". '
                    });
                    return;
                } else {
                    solicitudE.estado = 'DESIERTA';
                    solicitudE.fechaActualizacion = new Date().getTime().toString();
                    await db.collection('solicitudesDesiertas').doc(doc.id).set(solicitudE).then(async solicitudDesierta => {
                        if (solicitudDesierta) {
                            await res.status(200).json({
                                ok: true,
                                message: 'Solicitud se ha Desertado exitosamente.'
                            });
                        } else {
                            await res.status(400).json({
                                ok: false,
                                message: 'No tiene permisos para cambiar de estado la solicitud.'
                            });
                        }
                    })
                }
            });
        }
    })
});


app.post('/cambioDemanda', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTrans = req.body.emailTransportador;
    const demanda = req.body.demanda;


    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudessRef = db.collection('solicitudes');
    await solicitudessRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotSolicitud => {
        if (snapshotSolicitud.empty) {
            res.status(401).json({
                ok: false,
                message: 'No existe la solicitud.'
            });
            return
        } else {
            snapshotSolicitud.forEach(async doc => {
                let solicitud = await doc.data();
                let preaceptado = solicitud.preAceptados.get();
                preaceptado.forEach((preAceptad: { emailTransportador: any; demandaTransportador: any; }) => {
                    if (preAceptad.emailTransportador === emailTrans) {
                        preAceptad.demandaTransportador = demanda;
                    }

                });




            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     res.status(400).json({
    //         ok: false,
    //         message: 'No existe la solicitud',
    //     });
    // });


});

app.post('/cancelarSolicitudTrans', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTransportador = req.body.emailTransportador;
    const emailPasajero = req.body.emailPasajero;
    // const nombreTransportador = req.body.nombreTransportador;
    // const demandaTransportador = Number(req.body.demandaTransportador);
    // const avatarTransportador = req.body.avatarTransportador;




    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudesRef = db.collection('solicitudes');
    await solicitudesRef.where('idSolicitud', '==', Number(idSolicitud)).get().then(async snapshot => {
        if (snapshot.empty) {
            // NO ESXISTE ESTA SOLICITUD EN A BASE DE DATOS
            console.log('No Existe Id en la Base de Datos 001');
            res.status(401).json({
                ok: false,
                message: 'No existe esta solicitud en la base de datos.'
            });
            return;
        } else {
            // EXISTE EL USUARIO EN LA BASE DE DATOS Y PROCEDEMOS A ACTUALIZAR SUS DATOS
            snapshot.forEach(async doc => {
                // Recuperamos el usuario de la base de datos
                let solicitud = await doc.data();
                // Actualizamos el usuario de la base de datos 
                solicitud.estado = 'PENDIENTE'
                delete solicitud.nombreTransportador
                delete solicitud.avatarTransportador
                solicitud.fechaActualizacion = new Date().getTime().toString();
                delete solicitud.valorFinal
                const idsolicitud = doc.id;  //  este es el id del documento



                await db.collection('solicitudes').doc(idsolicitud).set(solicitud).then(async solicitudActualizada => {
                    if (solicitudActualizada) {
                        // AQUI LE ENVIAMOS UN MENSAJE AL USUARIO
                        const usuariosRef = await db.collection('usuarios');
                        // NOTIFICAMOS AL USUARIO QUE SU SOLICITUD FUE ACEPTADA  ===========================
                        await usuariosRef.where('email', '==', emailTransportador).get().then(async snapshotEmail => {
                            if (snapshotEmail.empty) {
                                // NO EXISTE ESTE USUARIO EN LA BASE DE DATOS
                                console.log('No existe este usuario en la base de datos 001');

                                res.status(401).json({
                                    ok: false,
                                    message: 'No existe este usuario en la base de datos.'
                                });
                                return;
                            } else {
                                // Cambios los camos de usuario
                                console.log('TRABAJANDO CON PASAJERO... 001');
                                snapshotEmail.forEach(async doc2 => {
                                    // Recuperamos el usurio de la base de datos
                                    let transportador = await doc2.data();
                                    const transId = doc2.id;
                                    transportador.motoOcupada = false;
                                    transportador.carroOcupado = false;


                                    //inicio await transportador
                                    await db.collection('usuarios').doc(transId).set(transportador).then(async transActualizada => {
                                        if (transActualizada) {
                                            console.log('PASAJERO Actualizado 001');
                                            res.status(200).json({
                                                ok: true,
                                                message: 'Solicitud cancelada.'
                                            });


                                            await usuariosRef.where('email', '==', emailPasajero).get().then(async snapshotEmailPasajero => {
                                                snapshotEmailPasajero.forEach(async doc3 => {
                                                    let pasajero = await doc3.data();
                                                    const pasId = doc3.id;
                                                    pasajero.mensajeServidor.push({
                                                        id: new Date().getTime().toString(),
                                                        message: 'SU SOLICITUD HA SIDO CANCELADA',
                                                        visto: false
                                                    });

                                                    await db.collection('usuarios').doc(pasId).set(pasajero).then(async usuarioModificado => {
                                                        console.log(usuarioModificado);
                                                    })
                                                })
                                            })
                                        }
                                        else {
                                            console.log('Fallo al actualiazar USUARIO 001');
                                            res.status(401).json({
                                                ok: false,
                                                message: 'Fallo al Actualizar USUARIO'
                                            });

                                        }
                                        //catch de away transportador
                                    })
                                    // .catch(function (error: any) {
                                    //     //catch de await usuario modificiado
                                    //     console.log('Error, al actulizar usuario 002 ', error);
                                    //     res.status(400).json({
                                    //         ok: false,
                                    //         message: 'Error, al actualizar usuario',
                                    //     });
                                    // });
                                })
                            }

                        })
                        // .catch(function (error: any) {
                        //     //catch de await usuario modificiado
                        //     console.log('Error, al buscar pasajero 003 ', error);
                        //     res.status(400).json({
                        //         ok: false,
                        //         message: 'Error, al buscar usuario',
                        //     });
                        // });

                    } else {
                        res.status(200).json({
                            ok: false,
                            message: 'Error al intentar cancelar solicitud'
                        })
                        return;
                    }
                }, error => {
                    return res.status(401).json({
                        ok: false,
                        messaje: 'Error al actualizar la solicitud CarroSpeedy',
                        error
                    });
                })
            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('Error, al buscar solicitud  004 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'Error, al buscar solicitud',
    //     });
    // });
})



app.post('/cancelarSolicitudPasajero', async (req, res) => {

    const idSolicitud = Number(req.body.idSolicitud);
    const emailTransportador = req.body.emailTransportador;
    // const nombreTransportador = req.body.nombreTransportador;
    // const demandaTransportador = Number(req.body.demandaTransportador);
    // const avatarTransportador = req.body.avatarTransportador;




    // VALIDAMOS QUE EL IDENTIFICACION QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudesRef = db.collection('solicitudes');
    await solicitudesRef.where('idSolicitud', '==', Number(idSolicitud)).get().then(async snapshot => {
        if (snapshot.empty) {
            // NO ESXISTE ESTA SOLICITUD EN A BASE DE DATOS
            console.log('No Existe Id en la Base de Datos 001');
            res.status(401).json({
                ok: false,
                message: 'No existe esta solicitud en la base de datos.'
            });
            return;
        } else {
            // EXISTE EL USUARIO EN LA BASE DE DATOS Y PROCEDEMOS A ACTUALIZAR SUS DATOS
            snapshot.forEach(async doc => {
                // Recuperamos el usuario de la base de datos
                let solicitud = await doc.data();
                // Actualizamos el usuario de la base de datos 
                console.log('DEBE CANCEALARCE', solicitud.emailTransportador);
                solicitud.estado = 'PENDIENTE'
                delete solicitud.nombreTransportador
                delete solicitud.avatarTransportador
                solicitud.fechaActualizacion = new Date().getTime().toString();
                delete solicitud.valorFinal
                const idsolicitud = doc.id;  //  este es el id del documento
                const solicitudModificada = solicitud;


                await db.collection('solicitudes').doc(idsolicitud).set(solicitudModificada).then(async solicitudActualizada => {
                    if (solicitudActualizada) {
                        // AQUI LE ENVIAMOS UN MENSAJE AL USUARIO
                        const usuariosRef = db.collection('usuarios');
                        // NOTIFICAMOS AL USUARIO QUE SU SOLICITUD FUE ACEPTADA  ===========================
                        await usuariosRef.where('email', '==', emailTransportador).get().then(async snapshotEmail => {
                            if (snapshotEmail.empty) {
                                // NO EXISTE ESTE USUARIO EN LA BASE DE DATOS
                                console.log('No existe este usuario en la base de datos 001');

                                res.status(401).json({
                                    ok: false,
                                    message: 'No existe este usuario en la base de datos.'
                                });
                                return;
                            } else {
                                // Cambios los camos de usuario
                                console.log('TRABAJANDO CON PASAJERO... 001');
                                snapshotEmail.forEach(async doc2 => {
                                    // Recuperamos el usurio de la base de datos
                                    let transportador = await doc2.data();
                                    let transId = doc2.id;
                                    transportador.motoOcupada = false;
                                    transportador.carroOcupado = false;
                                    transportador.mensajeServidor.push({
                                        id: new Date().getTime().toString(),
                                        message: 'SU SOLICITUD HA SIDO CANCELADA',
                                        visto: false
                                    });


                                    //inicio await transportador
                                    await db.collection('usuarios').doc(transId).set(transportador).then(async transActualizada => {
                                        if (transActualizada) {
                                            console.log('PASAJERO Actualizado 001');
                                            res.status(200).json({
                                                ok: true,
                                                message: 'Solicitud cancelada.'
                                            });
                                        }
                                        else {
                                            console.log('Fallo al actualiazar USUARIO 001');
                                            res.status(401).json({
                                                ok: false,
                                                message: 'Fallo al Actualizar USUARIO'
                                            });

                                        }
                                        //catch de away transportador
                                    })
                                    // .catch(function (error: any) {
                                    //     //catch de await usuario modificiado
                                    //     console.log('Error, al actulizar usuario 002 ', error);
                                    //     res.status(400).json({
                                    //         ok: false,
                                    //         message: 'Error, al actualizar usuario',
                                    //     });
                                    // });
                                })
                            }

                        })
                        // .catch(function (error: any) {
                        //     //catch de await usuario modificiado
                        //     console.log('Error, al buscar pasajero 003 ', error);
                        //     res.status(400).json({
                        //         ok: false,
                        //         message: 'Error, al buscar usuario',
                        //     });
                        // });

                    } else {
                        res.status(200).json({
                            ok: false,
                            message: 'Error al intentar cancelar solicitud'
                        })
                        return;
                    }
                }, error => {
                    return res.status(401).json({
                        ok: false,
                        messaje: 'Error al actualizar la solicitud CarroSpeedy',
                        error
                    });
                })
            });
        }
    })
    // .catch(function (error: any) {
    //     //catch de await usuario modificiado
    //     console.log('Error, al buscar solicitud  004 ', error);
    //     res.status(400).json({
    //         ok: false,
    //         message: 'Error, al buscar solicitud',
    //     });
    // });
})

app.get('/solicitudDelete/:id', async (req, res) => {

    const id = Number(req.params.id);
    // RECUPERAMOS el dato id que viene por la URL
    // VALIDAMOS QUE EL ID QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudRef = db.collection('solicitudes');


    await solicitudRef.where('idSolicitud', '==', Number(id)).get().then(async snapshot => {
        if (snapshot.empty) {
            // NO EXISTE ESTE SOLICTUD EN A BASE DE DATOS
            res.status(401).json({
                ok: false,
                message: 'No existe esta solictud en la base de datos.'
            });

        } else {

            // EXISTE lA SOLICITUD EN LA BASE DE DATOS Y PROCEDEMOS A ELIMINAR SUS DATOS
            snapshot.forEach(async doc => {

                const idSol = await doc.id;  //  este es el id del documento
                let solicitud: any = doc.data();
                solicitud.estado = 'ELIMINADA-USUARIO';
                // CREAMOS UN NODO CON LAS SOLICITUDES ELIMINADAS
                await db.collection('solicitudesEliminadas').add({
                    solicitud
                }).then(solicitudEliminadaRef => {
                    db.collection('solicitudes').doc(idSol).delete().then(async solicitudEliminada => {

                        if (solicitudEliminada) {
                            res.status(200).json({
                                ok: true,
                                solicitudEliminada
                            });
                            return;
                        }
                    }, error => {
                        return res.status(401).json({
                            ok: false,
                            messaje: 'Error al eliminar la solicitud',
                            error
                        });
                    })
                })

            });
        }
    })
})

app.post('/finalizarSolicitud', async (req, res) => {

    // const emailTransportador = req.body.emailTransportador;
    const idSolicitud = Number(req.body.idSolicitud);

    // VALIDAMOS QUE EL IDENTIDAD QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
    const solicitudesRef = db.collection('solicitudes');
    await solicitudesRef.where('idSolicitud', '==', idSolicitud).get().then(async snapshotSolicitud => {
        if (snapshotSolicitud.empty) {
            // NO EXISTE ESTA SOLICITUD EN LA BASE DE DATOS
            res.status(401).json({
                ok: false,
                message: 'No existe esta solicitud en la base de datos 001'
            });
            return;
        } else {
            // EXISTE LA SOLICITUD EN LA BASE DE DATOS Y PROCEDEMOS A ACTUALIZAR SUS DATOS
            snapshotSolicitud.forEach(async doc1 => {
                // Recuperamos el usuario de la base de datos
                let solicitud = await doc1.data();
                // Actualizamos el usuario de la base de datos 
                solicitud.estado = 'TERMINADA';
                solicitud.fechaActualizacion = new Date().getTime().toString();
                const idSol = doc1.id;

                await db.collection('solicitudes').doc(idSol).set(solicitud).then(async solicitudActualizada => {
                    if (solicitudActualizada) {
                        await db.collection('carreras').add({
                            solicitud,
                        }).then(async () => {
                            console.log('Adicion a carrera Exitosa 001');
                            const usuariosRef = db.collection('usuarios');
                            // NOTIFICAMOS AL USUARIO QUE SU SOLICITUD FUE ACEPTADA  ===========================
                            await usuariosRef.where('email', '==', solicitud.emailTransportador).get().then(async snapshotTransportador => {
                                if (snapshotTransportador.empty) {
                                    // NO EXISTE ESTE USUARIO EN A BASE DE DATOS
                                    res.status(401).json({
                                        ok: false,
                                        message: 'No existe este transportador en la base de datos.'
                                    });
                                    return;
                                } else {
                                    // SI EXISTE ESTE USUARIO EN LA BASE DE DATOS LE ENVIAMOS UN MENSAJE
                                    snapshotTransportador.forEach(async (doc2) => {

                                        let transportador = await doc2.data();
                                        const idTrans = doc2.id;
                                        if ((solicitud.tipo === 'MOTOCARRERA') || (solicitud.tipo === 'MOTOMENSAJERIA')) {
                                            transportador.motoOcupada = false;
                                            transportador.saldoMotoSpeedy = Number(transportador.saldoMotoSpeedy) - 800
                                        }
                                        else if ((solicitud.tipo === 'CARROCARRERA') || (solicitud.tipo === 'CARROMENSAJERIA')) {
                                            transportador.carroOcupado = false;
                                            transportador.saldoMotoCarroSpeedy = Number(transportador.saldoMotoCarroSpeedy) - 800
                                        }

                                        transportador.mensajeServidor.push({
                                            id: new Date().getTime(),
                                            message: 'Carrera terminada con éxito,',
                                            visto: false
                                        });
                                        await db.collection('usuarios').doc(idTrans).set(transportador).then(async transportadorModificicado2 => {
                                            // CAMBIAMOS EL VALOR DE "carroOcupado" DEL CARROSPEEDY A TRUE y le agregamos la solicitud ===========================
                                            if (transportadorModificicado2) {
                                                await usuariosRef.where('email', '==', solicitud.emailPasajero).get().then(async snapshotPasajero => {
                                                    if (snapshotPasajero.empty) {
                                                        snapshotPasajero.forEach(async (doc3) => {

                                                            let pasajero = await doc3.data();
                                                            pasajero.mensajeServidor.push({
                                                                id: new Date().getTime(),
                                                                message: 'Su carrera ha finalizado con éxito.',
                                                                visto: false
                                                            });
                                                            const idPas = doc3.id;

                                                            await db.collection('usuarios').doc(idPas).set(pasajero).then(async pasajerorModificicado3 => {
                                                                console.log(pasajerorModificicado3);
                                                                return;
                                                            })
                                                        })
                                                    }
                                                })

                                            }
                                            else {
                                                console.log('error actulizando transportador 003');

                                            }
                                        })
                                        // .catch(function (error: any) {
                                        //     //catch de await usuario modificiado
                                        //     console.log('Error, al actulizar transportador 002 ', error);
                                        //     res.status(400).json({
                                        //         ok: false,
                                        //         message: 'Error, al actualizar transportador',
                                        //     });
                                        // });
                                    })
                                }
                            })
                        })
                    } else {
                        res.status(400).json({
                            ok: false,
                            message: 'Error en el proceso',
                        });
                        return;
                    }

                })
            })
        }
    })

})

app.get('/getCarrera', async (req, res) => {

    const carrerasRef = db.collection('carreras');
    const docsSnapshot = await carrerasRef.get();
    const carreraArray = docsSnapshot.docs.map(doc => doc.data());
    if (carreraArray) {
        return res.status(200).json({
            ok: true,
            carreraArray
        });
    } else {
        return res.status(400).json({
            ok: false,
            message: 'No se pudieron obtener las carreras'
        })
    }
})


module.exports = app;  
