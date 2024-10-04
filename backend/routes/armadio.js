const { ObjectId } = require("bson");
const express = require("express");
const router = express.Router();
const Armadio = require("../models/armadio");
const armadioFarmaci = require("../models/armadioFarmaci");
const attivitaFarm = require("../models/attivitaFarmaciPresidi");
const Camere = require("../models/camere");
const Paziente = require("../models/pazienti");
const registroArmadi = require("../models/registroArmadi");
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;



router.get("/registro", async (req, res) => {
    try {
        const getData = async () => {
            const query = [
                {
                    '$match': {
                        'stato': true
                    }
                },
                {
                    '$match': {
                        'note': {
                            '$nin': ["Creato armadio", "Inserimento Indumento"]
                        }
                    }
                },
                {
                    '$lookup': {
                        'from': 'pazienti',
                        'localField': 'paziente',
                        'foreignField': '_id',
                        'as': 'pazienteInfo'
                    }
                },
                {
                    '$lookup': {
                        'from': 'camera',
                        'localField': 'idCamera',
                        'foreignField': '_id',
                        'as': 'cameraInfo'
                    }
                }
            ];
            // console.log("Query by piano: ", query);
            return await registroArmadi.aggregate(query).exec();
        };

        const registro = await getData();
        res.status(200).json(registro);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err.message });
    }
});


router.get("/", async (req, res) => {
    try {
        // Get the redisDisabled flag from the app settings
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Armadio.find();
        };

        // Directly fetch data from MongoDB if redis is disabled or undefined
        const armadio = await getData();
        res.status(200).json(armadio);
    } catch (err) {
        console.error("Error: ", err);
        res.status(500).json({ Error: err });
    }
});



router.get("/camera/:id", async (req, res) => {
    const { id } = req.params;
    let dateRif = req.query.date;

    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        //new Armadio({
        //  idCamera: new ObjectId("6233776e7ec5d255b8cb1919"),
        //  contenuto: [
        //    {
        //      idPaziente: new ObjectId("6172d8631340fec684deea28"),
        //      items: [
        //        {
        //          nome: "Calzini",
        //          quantita: 1,
        //          note: "Calzini di notte",
        //        }
        //      ]
        //    },
        //    {
        //      idPaziente: new ObjectId("61815ef594bb265624eddb78"),
        //      items: [
        //        {
        //          nome: "Pantaloni",
        //          quantita: 1,
        //          note: "Pantaloni neri",
        //        }
        //      ]
        //    }
        //  ],
        //  lastChecked: {
        //    idUser: new ObjectId("62262a3e4a682930a8f3ee4e"),
        //    data: new Date(),
        //  }
        //}).save()
        //console.log("Save Armadio");

        const getData = () => {
            const query = [
                {
                    '$match': {
                        'idCamera': ObjectId(id),
                        'dateStartRif': { $lte: new Date(dateRif.toString()) },
                        'dateEndRif': { $gte: new Date(dateRif.toString()) }
                    }
                }, {
                    '$lookup': {
                        'from': 'pazienti',
                        'localField': 'contenuto.idPaziente',
                        'foreignField': '_id',
                        'as': 'pazienti'
                    }
                }
            ];

            // console.log("Armadi query:", query);
            // console.log("Armadi dateRif:", dateRif);
            return Armadio.aggregate(query);
        };

        const armadio = await getData();
        res.status(200).json(armadio);
        return;

        if (redisClient == undefined || redisDisabled) {
            const armadio = await getData();
            res.status(200).json(armadio);
            return;
        }

        const searchTerm = `ARMADIO${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const armadio = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(armadio));
                res.status(200).json(armadio);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/camera/get/:id", async (req, res) => {
    const { id } = req.params;
    let dateRif = req.query.date;

    try {
        const getData = () => {
            const query = [
                {
                    '$match': {
                        'idCamera': ObjectId(id),
                    }
                }
            ];

            // console.log("Armadi query:", query);
            // console.log("Armadi dateRif:", dateRif);
            return Armadio.aggregate(query);
        };

        const armadio = await getData();
        res.status(200).json(armadio);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});



router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        const getData = () => {
            return Armadio.findById(id);
        };

        if (redisClient == undefined || redisDisabled) {
            const armadio = await getData();
            res.status(200).json(armadio);
            return;
        }

        const searchTerm = `ARMADIO${id}`;
        redisClient.get(searchTerm, async (err, data) => {
            if (err) throw err;

            if (data) {
                res.status(200).send(JSON.parse(data));
            } else {
                const armadio = await getData();

                redisClient.setex(searchTerm, redisTimeCache, JSON.stringify(armadio));
                res.status(200).json(armadio);
            }
        });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

router.get("/paziente/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Assicurati che Armadio sia importato correttamente
        const registro = await Armadio.find({ pazienteId: id });
        console.log(registro);
        if (!registro) {
            return res.status(404).json({ message: "Paziente non trovato" });
        }

        res.status(200).json(registro);
    } catch (err) {
        console.error("Errore durante il recupero dei dati: ", err);
        res.status(500).json({ error: "Si è verificato un errore durante il recupero dei dati." });
    }
});



router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const armadio = await Armadio.updateOne(
            { _id: id },
            {
                $set: req.body.armadio,
            }
        );

        // const idCamera = req.body.armadio.idCamera;
        var checked = 0;
        switch (req.body.armadio.rateVerifica) {
            case 0:
                checked = 0;
                break;
            case 100:
                checked = 2;
                break;
            default:
                checked = 1;
        }

        console.log("Armadio Salvato!!");
        await Camere.updateOne(
            { _id: req.body.armadio.idCamera },
            {
                $set: {
                    armadioCheck: checked,
                    dataArmadioCheck: req.body.armadio.lastChecked.datacheck,
                    firmaArmadio: req.body.armadio.lastChecked.idUser,
                },
            }
        );
        console.log("Camere Salvato!!");
        console.log(req.body);
        const registro = new registroArmadi({
            stato: req.body.armadio.verified,
            idCamera: req.body.armadio.idCamera,
            paziente: req.body.armadio.pazienteId,
            data: req.body.armadio.lastChecked.datacheck,
            note: req.body.note,
            firma: req.body.armadio.lastChecked.idUser
        });
        console.log(registro);
        const result = await registro.save();

        console.log("registro Salvato!!");
        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `ARMADIO${id}`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(armadio);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getData = () => {
            return Armadio.findById(id);
        };
        getData.cancellato = true;
        getData.DataEliminazione = new Date();
        const armadio = await Armadio.updateOne(
            { _id: id },
            {
                $set: getData,
            }
        );

        // const idCamera = req.body.armadio.idCamera;
        var checked = 0;
        switch (getData.rateVerifica) {
            case 0:
                checked = 0;
                break;
            case 100:
                checked = 2;
                break;
            default:
                checked = 1;
        }

        await Camere.updateOne(
            { _id: getData.idCamera },
            {
                $set: {
                    armadioCheck: checked,
                    dataArmadioCheck: getData.lastChecked.datacheck,
                    firmaArmadio: getData.lastChecked.idUser,
                },
            }
        );

        const registro = new registroArmadi({
            cameraId: getData.idCamera,
            stato: checked,
            data: getData.lastChecked.datacheck,
            note: "Eliminato!!",
            firma: getData.lastChecked.idUser
        });

        const result = await registro.save();


        redisClient = req.app.get("redis");
        redisDisabled = req.app.get("redisDisabled");

        if (redisClient != undefined && !redisDisabled) {
            const searchTerm = `ARMADIO${id}`;
            redisClient.del(searchTerm);
        }

        res.status(200);
        res.json(armadio);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});


router.post("/", async (req, res) => {
    try {
        // Crea e salva il documento 'Armadio'
        const armadio = new Armadio(req.body.armadio);
        const resultArmadio = await armadio.save();

        // Crea e salva il documento 'Registro Armadi'
        const registro = new registroArmadi({
            idCamera: req.body.armadio.idCamera,
            stato: false,
            paziente: req.body.armadio.pazienteId,
            data: new Date(),
            note: req.body.note,
            firma: req.body.armadio.lastChecked.idUser,
        });
        const resultRegistro = await registro.save();

        // Crea e salva il documento 'Armadio Farmaci'
        const ArmFarm = new armadioFarmaci({
            pazienteId: req.body.armadio.pazienteId,
            farmaci: [],
            presidi: [],
            cancellato: false,
            dataCreazione: new Date(),
            lastChecked: req.body.armadio.lastChecked,
        });
        await ArmFarm.save();

        // Recupera le informazioni del paziente
        const paziente = await Paziente.findById(ArmFarm.pazienteId);
        if (!paziente) {
            return res.status(404).json({ error: "Paziente non trovato" });
        }

        const nome = `${paziente.nome} ${paziente.cognome}`;

        // Crea e salva il documento 'AttivitaFarm'
        const attivitaF = new attivitaFarm({
            operator: req.body.armadio.lastChecked._id,
            operatorName: req.body.armadio.lastChecked.idUser,
            operation: "Creazione armadio farmaci",
            type: "ArmadioFarmaci",
            dataOP: new Date(),
            paziente: req.body.armadio.pazienteId,
            pazienteName: nome,
        });

        await attivitaF.save();

        // Risposta con il documento 'armadio' salvato
        res.status(200).json(resultArmadio);
    } catch (err) {
        // Risposta in caso di errore
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
