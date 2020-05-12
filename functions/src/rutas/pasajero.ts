// import * as admin from 'firebase-admin';
// import * as express from 'express';
// import * as cors from 'cors';
// import { IPosition } from '../Interfaces';



// const app = express();
// app.use(cors({ origin: true }));

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
//   next();
// });



// const db = admin.firestore();



// app.post('/crearUsuarioPasajero', async (req, res) => {

//   const uid = String(req.body.identificacion);
//   const identificacion = String(req.body.identificacion);
//   const email = req.body.email;
//   const password = req.body.password;
//   const nombres = req.body.nombres;
//   const avatar = req.body.email;
//   const municipio = req.body.municipio;
//   const telefono = req.body.telefono || 'NO';
//   const terminos = true;
//   const codigoLider = req.body.codigoLider || ' ';
//   const codigoPasajero = req.body.codigoPasajero || '';
//   const codigoTransportador = req.body.codigoTransportador || '';
//   const habilitadoPasajero = req.body.habilitadoPasajero || false;
//   const habilitadoLider = req.body.habilitadoLider || false;
//   const habilitadoTransportador = req.body.habilitadoTransportador || false;
//   const habilitadoPasajero = req.body.habilitadoPasajero || false;
//   const habilitadoPasajero = req.body.habilitadoPasajero || false;
//   const habilitadoPasajero = req.body.habilitadoPasajero || false;
//   const habilitadoMotoSpeedy = req.body.habilitadoMotoSpeedy || false;
//   const habilitadoCarroSpeedy = req.body.habilitadoCarroSpeedy || false;
//   const habilitadoCarroCarrera = req.body.habilitadoCarroCarrera || false;
//   const habilitadoCarroMensajeria = req.body.habilitadoCarroMensajeria || false;
//   const habilitadoMotoCarrera = req.body.habilitadoMotoCarrera || false;
//   const habilitadoMotoMensajeria = req.body.habilitadoMotoMensajeria || false;
//   const historicoPasajero = [];
//   const historicoMotoSpeedy = [];
//   const historicoCarroSpeedy = [];
//   const saldoMotoSpeedy = 0;
//   const saldoMotoCarroSpeedy = 0;
//   const motoOcupada = false;
//   const carroOcupado = false;
//   const usuarioIdLider = 0;
//   const fechaCreacion = new Date().getTime().toString();
//   const fechaActualizacion = new Date().getTime().toString();
//   const ultimoLogin = new Date().getTime().toString();
//   const mensajeServidor: any[] = [];
//   mensajeServidor.push({
//     id: new Date().getTime().toString(),
//     message: 'Sr Usuario Felicidades, ahora perteneces al gran Club Speedy.',
//     visto: false
//   })


//   const refUsuarioLider2 = await db.collection('usuarioLider');

//   refUsuarioLider2.where('codigoLider', '==', codigoLider).get().then(async snapshotLider => {
//     if (snapshotLider.empty) {
//       res.status(400).json({
//         ok: false,
//         message: 'No existe el códido asociado digitado, verificar código.'
//       });
//       return
//     } else {
//       // VALIDAMOS QUE EL USUARIO NO TENGA LA MISMA IDENTIDAD
//       const pasajeroIdentidad = await db.collection('usuarioPasajero');
//       // tslint:disable-next-line: no-floating-promises
//       pasajeroIdentidad.where('identificacion', '==', identificacion).get().then(async snapshotIdentidadPasajero => {
//         if (snapshotIdentidadPasajero.empty) {
//           // el di o esta en la coleccion pasajero procedmos buscado en el nodo trannsportador
//           const transportadorIdentidad = await db.collection('usuarioTransportador');
//           // tslint:disable-next-line: no-floating-promises
//           transportadorIdentidad.where('identificacion', '==', identificacion).get().then(async snapshotIdentidadTransportador => {
//             if (snapshotIdentidadTransportador.empty) {
//               const liderIdentidad = await db.collection('usuarioLider');
//               // tslint:disable-next-line: no-floating-promises
//               liderIdentidad.where('identificacion', '==', identificacion).get().then(async snapshotIdentidadLider => {
//                 if (snapshotIdentidadLider.empty) {

//                   // SE CREA EL USUARIO EN  admin.authN
//                   admin.auth().createUser({
//                     uid: uid,
//                     email: email,
//                     password: password,
//                   })
//                     .then(async function (userRecord) {

//                       // CUANDO SE CREE EN ATENTICATION SE CREE EN DATABASE FIRESTORE
//                       snapshotLider.forEach(doc => {
//                         const usuarioIdLider = doc.id;

//                         // EXISTE ESTE CODIGO LIDER EN LA BASE DE DATOS SE ADD LOS CAMPSO ALA COLECCION USERPASAJERO
//                         db.collection('usuarioPasajero').add({
//                           uid: uid,
//                           identificacion: identificacion,
//                           email: email,
//                           password: password,
//                           nombres: nombres,
//                           avatar: avatar,
//                           municipio: municipio,
//                           codigoLider: codigoLider,
//                           codigoPasajero: codigoPasajero,
//                           telefono: telefono,
//                           habilitado: habilitado,
//                           habilitadoPasajero: habilitadoPasajero,
//                           cambioUsuario: cambioUsuario,
//                           usuarioIdLider: usuarioIdLider,
//                           fechaCreacion: fechaCreacion,
//                           fechaActualizacion: fechaActualizacion,
//                           ultimoLogin: ultimoLogin,
//                           mensajeServidor: mensajeServidor,
//                         }).then(usuarioGuardado => {
//                           res.status(200).json({
//                             ok: true,
//                             message: 'Usuario registrado con éxito'
//                           });
//                           return;
//                         }).catch(function (error: any) {
//                           res.status(400).json({
//                             ok: false,
//                             message: 'Error al registrar el usuario.'
//                           });
//                           return;
//                         });
//                       })
//                     }).catch(function (error: any) {
//                       console.log('Error creating new user:008', error);
//                       res.status(400).json({
//                         ok: false,
//                         message: 'Error al registrar el usuario, verifique que su correo no esté registrado'
//                       });
//                       return;
//                     });

//                 }
//               })
//             } else {
//               res.status(200).json({
//                 ok: false,
//                 message: 'YA EXISTE UN USUARIO CON ESTA IDENTIFICACION EN LA LISTA DE TRANSPORTADOR'
//               });
//               return
//             }
//           }).catch(function (error: any) {
//             console.log('USUARIO YA EXISTE EN LA LISTA DE TRANSPORTADORES', error);
//           });

//         } else {
//           res.status(200).json({
//             ok: false,
//             message: 'YA ESTA REGISTRADO UN USUARIO CON ESA IDENTIFICACION'
//           });
//           return
//         }
//       });
//     }

//   }).catch(function (error: any) {
//     console.log('USUARIO YA EXISTE EN LA LISTA DE LIDER', error);
//   });

// });//fin del post

// // app.get('/getPasajero', async (req, res) => {

// //   // let jwt = new JWT().validarToken(req);

// //   // if (jwt.ok) {
// //   const refPasajero = db.collection('usuarioPasajero');
// //   const snapshotPasajero = await refPasajero.get();

// //   const pasajeros = snapshotPasajero.docs.map(doc => doc.data());

// //   if (pasajeros) {
// //     return res.status(200).json({
// //       ok: true,
// //       pasajeros
// //     });
// //   } else {
// //     return res.status(400).json({
// //       ok: false,
// //       message: 'No se pudieron obtener los Pasajeros.'
// //     })
// //   }
// // })


// // app.post('/enviarMensajeUno', async (req, res) => {


// //   // RECUPERAMOS los datos que viene por post y lo guardamos en un objeto
// //   const identificacion = req.body.identificacion;
// //   const mensaje = req.body.mensaje;


// //   // VALIDAMOS QUE EL IDENTIDAD QUE SE POSTEÓ EXISTA Y RECUPERAMOS SUS DATOS
// //   const usuariosRef = await db.collection('usuarioPasajero');
// //   usuariosRef.where('identificacion', '==', identificacion).get().then(async snapshot => {
// //     if (snapshot.empty) {
// //       // NO ESXISTE ESTE USURIO EN A BASE DE DATOS
// //       res.status(401).json({
// //         ok: false,
// //         message: 'No existe este usuario en la base de datos.'
// //       });

// //     } else {
// //       // EXISTE EL USUARIO EN LA BASE DE DATOS Y PROSEDEMOS A ACTUALIZAR SUS DATOS
// //       snapshot.forEach(doc => {
// //         // Recuperamos el usurio de la base de datos
// //         const usuario = doc.data();
// //         // let id = doc.id;
// //         // Actualizamos el usuario de la base de datos en el local
// //         usuario.mensajeServidor.push({
// //           id: new Date().getTime().toString(),
// //           message: mensaje,
// //           visto: false
// //         });


// //         let idUserDoc = doc.id;  //  este es el id del documento
// //         let usuarioModificado = usuario;
// //         db.collection('users').doc(idUserDoc).set(usuarioModificado).then(usuarioActualizado => {
// //           if (usuarioActualizado) {
// //             res.status(200).json({
// //               ok: true,
// //               usuarioModificado
// //             });
// //             return;
// //           }
// //         }, error => {
// //           return res.status(401).json({
// //             ok: false,
// //             messaje: 'Error al actualizar el usuario',
// //             error
// //           });
// //         })
// //       });
// //     }
// //   }).catch(function (error: any) {
// //     console.log('Error creando nuevo usuario:006', error);
// //     return res.status(400).json({
// //       ok: false,
// //       error: 'Error enviando mensaje 006 '
// //     });
// //   });
// // })



// // app.post('/sendPasajeros', async (req, res) => {

// //   // let jwt = new JWT().validarToken(req);

// //   // if (jwt.ok) {

// //   const email = req.body.email;

// //   const usuariosRef = db.collection('usuarioPasajero');

// //   await usuariosRef.where('email', '==', email).get().then(snapshot => {
// //     if (snapshot.empty) {
// //       res.status(400).json({
// //         ok: false,
// //         message: 'No se encontró email en la base de datos 001'
// //       });
// //       return;
// //     } else {
// //       return res.status(200).json({
// //         ok: true,
// //         snapshot
// //       });
// //     }

// //   }).catch(function (error: any) {
// //     console.log('Error consultando usuario', error);
// //     return res.status(400).json({
// //       ok: false,
// //       error: 'Error creando el usuario 007, usuario o email ya existe '
// //     });
// //   });

// // })





// // ============== LOGIN DE USUARIO 
// // app.post('/loginPasajero', async (req, res) => {

// //   const email = req.body.email;
// //   const password = req.body.password;


// //   const usuariosPasajero = db.collection('usuarioPasajero');
// //   await usuariosPasajero.where('email', '==', email).get().then(async snapshotPasajero => {
// //     if (snapshotPasajero.empty) {

// //       const usuariosTransportador = db.collection('usuarioTransportador');
// //       await usuariosTransportador.where('email', '==', email).get().then(async snapshotTransportador => {

// //         if (snapshotTransportador.empty) {
// //           const usuariosLider = db.collection('usuarioLider');
// //           await usuariosLider.where('email', '==', email).get().then(snapshotLider => {

// //             if (snapshotLider.empty) {
// //               res.status(400).json({
// //                 ok: false,
// //                 message: 'Usuario incorrecto'
// //               });
// //               return;
// //             } else {
// //               snapshotLider.forEach(doc => {

// //                 // Recuperamos el usurio de la base de datos
// //                 let usuario = doc.data();

// //                 // VALIDAMOS QUE EL LA CONTRASEÑA SEA CORRECTA
// //                 if (usuario.password != password) {
// //                   return res.status(400).json({
// //                     ok: false,
// //                     message: 'Password Incorrecto'
// //                   });
// //                 } else {

// //                   return res.status(200).json({
// //                     ok: true,
// //                     usuario
// //                   });
// //                 }
// //               });
// //             }
// //           });
// //         } else {
// //           snapshotTransportador.forEach(doc => {

// //             // Recuperamos el usurio de la base de datos
// //             let usuario = doc.data();

// //             // VALIDAMOS QUE EL LA CONTRASEÑA SEA CORRECTA
// //             if (usuario.password != password) {
// //               return res.status(400).json({
// //                 ok: false,
// //                 message: 'Password Incorrecto'
// //               });
// //             } else {

// //               return res.status(200).json({
// //                 ok: true,
// //                 usuario
// //               });
// //             }
// //           });
// //         }
// //       });

// //     } else {
// //       snapshotPasajero.forEach(doc => {

// //         // Recuperamos el usurio de la base de datos
// //         let usuario = doc.data();

// //         // VALIDAMOS QUE EL LA CONTRASEÑA SEA CORRECTA
// //         if (usuario.password != password) {
// //           return res.status(400).json({
// //             ok: false,
// //             message: 'Password Incorrecto'
// //           });
// //         } else {

// //           return res.status(200).json({
// //             ok: true,
// //             usuario
// //           });
// //         }
// //       });
// //     }
// //   }).catch(err => {
// //     console.log('Error Obteniendo Documentos', err);
// //   });
// // })







// module.exports = app;  