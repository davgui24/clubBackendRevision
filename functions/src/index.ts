import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
const request = require('request');
import * as moment from 'moment';

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://mototaxi-e3065.firebaseio.com"
  databaseURL: "https://clubspeedy-dev.firebaseio.com"
});

const db = admin.firestore();

const url = 'https://us-central1-clubspeedy-dev.cloudfunctions.net/api';
// url = 'http://localhost:5000/clubspeedy-dev/us-central1/api';

exports.myStorageFunction = functions
    .region('us-east1')
    .storage
    .object()
    .onFinalize((object) => {
      // ...
    });


const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cors({ origin: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});


app.use(require('./rutas/usuario'));
app.use(require('./rutas/solicitudes'));







const eliminarSolicitudes = async function () {
  setInterval(async () => {
    const solicitudesRef = db.collection('solicitudes');
    const docsSnapshot = await solicitudesRef.get();
    const solicitudes = docsSnapshot.docs.map(doc => doc.data());



    if (solicitudes.length > 0) {
      for (let solicitud of solicitudes) {
        await solicitudesRef.where('idSolicitud', '==', Number(solicitud.idSolicitud)).get().then(async snapshot => {
          snapshot.forEach(async doc => {
            // let idSolicitud = doc.id;

            if (solicitud.fechaActualizacion < new Date().getTime()) {

              let fechaActual = new Date().getTime();
              let dif = ((fechaActual - solicitud.fechaActualizacion) / 1000) / 60;

              // console.log(solicitud.estado);

              if (dif > 2 && solicitud.estado == 'PENDIENTE') {
                solicitud.estado = 'ELIMINADA'
                // CREAMOS UN NODO CON LAS SOLICITUDES ELIMINADAS
                await db.collection('solicitudes').doc(doc.id).set(solicitud).then(async solicitudActualizada => {
                  console.log(solicitudActualizada);
                })
                await db.collection('solicitudesEliminadas').add(solicitud).then(solicitudEliminadaRef => {
                  // console.log(solicitudEliminadaRef);
                  if (solicitudEliminadaRef) {
                    request.post({ url: `${url}/enviarMensajeUno`, form: { identidad: solicitud.identidad, mensaje: 'Su solicutud ha sido eliminada en estos momentos ya que ningún MotoSpeedy la atendió en dos minutos.' } }, function (err: any, httpResponse: any, body: any) {
                      console.log(err, body);
                    });
                  }
                })

              }
            }
          })
        })
      }

    }
  }, 120000)
}



// ==========================================================



const campoComisionFalse = async function () {
  console.log('OTRA', moment(Number('1584105369465')).format('DD/MM/YYYY HH:mm'));

  console.log('LAFECHA', new Date('09/03/2020'));
  console.log('LA FECHA DIA', new Date('2020/03/10').getDate());
  console.log('LA FECHA MES', new Date('2020/03/10').getMonth());
  console.log('LA FECHA AÑO', new Date('2020/03/10').getFullYear());
  setInterval(async () => {
      let valor7_0 = moment().format('DD/MM/YYYY 12:00');
      let valor7_5 = moment().format('DD/MM/YYYY 12:05');
      // let valor7_0 = moment().format('DD/MM/YYYY 20:48');
      // let valor7_3 = moment().format('DD/MM/YYYY 20:52');
      let ahora = moment(Number(new Date().getTime().toString())).format('DD/MM/YYYY HH:mm');
      if(ahora >= valor7_0 && ahora <= valor7_5){

        console.log('SI SE VA ATRABAJAR', ahora);
        console.log('INICIO', valor7_0);
        console.log('FIN', valor7_5);
        request(`${url}/deshabilitarComisionFalse`, function (err: any, httpResponse: any, body: any) {
          if (!err && httpResponse.statusCode == 200) {
            console.log(body); // Print the google web page.
          }


          if(err){
            console.log(err);
          }
        })

      }else{
        console.log('NO SE VA ATRABAJAR', ahora);
        console.log('INICIO', valor7_0);
        console.log('FIN', valor7_5);
      }
  }, 60000)
}



eliminarSolicitudes().then(
  () => {
    console.log('');
  }).catch(error => {
    console.log('ERROR', error);
  })

campoComisionFalse().then(() => {
  console.log('salio');
}).catch(error => {
  console.log('ERROR', error);
})



exports.api = functions.https.onRequest(app);