const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/", async (req, res) => {
  try {
    const searchTerm = `USERSALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json 
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const users = await Users.find();

        // Aggiorno la cache con i dati recuperati da mongodb
        client.setex(searchTerm, redisTimeCache, JSON.stringify(users));

        // Ritorna il json 
        res.status(200).json(users);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/users/[ID_USER]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `USERSBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const users = await Users.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(users));
        res.status(200).json(users);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/users (POST)
// INSERT dipendente su DB
router.post("/", async (req, res) => {
  try {
    const user = new Users({
        username: "",
        password: "",
        active: false,
        role: req.body.role
    });

    // Salva i dati sul mongodb
    const result = await user.save();

    const searchTerm = `USERSALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/users/[ID_USER]
// Modifica del dipendente
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Aggiorna il documento su mongodb
    const users = await Users.updateOne(
      { _id: id },
      {
        $set: {
            username: req.body.username,
            password: req.body.password,
            active: req.body.active
        },
      }
    );

    const searchTerm = `USERSBY${id}`;
    client.del(searchTerm);

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log('id:' + id);
    const user = await Users.remove({ _id: id });

    let searchTerm = `UserBY${id}`;
    client.del(searchTerm);
    searchTerm = `User${id}`;
    client.del(searchTerm);


    res.status(200);
    res.json(dipendente);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
