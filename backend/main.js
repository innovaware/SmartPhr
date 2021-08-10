const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
mongo = undefined;

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const dbPath = 'mongodb://innova:innova2019@192.168.1.10:27017/smartphr?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';


MongoClient.connect(dbPath, function(err, db) {
  if (err) {
    throw err;
  }
  mongo = db;
//   db.collection('pazienti').find().toArray(function(err, result) {
//     if (err) {
//       throw err;
//     }
//     console.log(result);
//   });
});

let pazienti = [
    {
      cognome: "Test",
      nome: "Test",
      sesso: "F",
      luogoNascita: "Catania",
      dataNascita: new Date("01-01-1980"),
      residenza: "via prova",
      statoCivile: "Sposata",
      figli: 2,
      scolarita: "Media",
      situazioneLavorativa: "Disoccupata",
      personeRiferimento: "Nessuno",
      telefono: "12345667895",
      dataIngresso: new Date(),
      provincia: "CT",
      localita: "Melfi",

      schedaPisico: {
        esame: {
          statoEmotivo: ["ansioso"],
          personalita: ["apatia"],
          linguaggio: ["fluente"],
          memoria: ["difficolta_rec"],
          orientamento: ["dis_temporale"],
          abilitaPercettivo: ["difficoltà_lett_scritt"],
          abilitaEsecutive: ["inflessibilita"],
          ideazione: ["allucinazioni"],
          umore: ["euforico"],

          partecipazioni: "noadeguata",
          ansia: "Presente",
          testEsecutivi: "Si",
        },

        valutazione: "Ciao",

        diario: [],
      },
    },
  ];


app.get('/api/pazienti', (req, res) => {
    mongo.collection('pazienti').find().toArray(function(err, result) {
        console.log(result);
        res.json(result);
    });
});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))