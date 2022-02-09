const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Dipendenti = require("../models/dipendenti");
const redis = require("redis");
const redisPort = process.env.REDISPORT || 6379;
const redisHost = process.env.REDISHOST || "redis";
const redisDisabled = process.env.REDISDISABLE === "true" || false;
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

const client = redis.createClient(redisPort, redisHost);

router.get("/info/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dipendenti = await Dipendenti.find({ idUser: id });
    res.status(200).json(dipendenti);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    const searchTerm = `USERALL`;
    // Ricerca su Redis Cache
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        // Dato trovato in cache - ritorna il json
        res.status(200).send(JSON.parse(data));
      } else {
        // Recupero informazioni dal mongodb
        const users = await User.find();

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

// http://[HOST]:[PORT]/api/user/[ID_USER]
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const searchTerm = `USERBY${id}`;
    client.get(searchTerm, async (err, data) => {
      if (err) throw err;

      if (data && !redisDisabled) {
        res.status(200).send(JSON.parse(data));
      } else {
        const user = await User.findById(id);

        client.setex(searchTerm, redisTimeCache, JSON.stringify(user));
        res.status(200).json(user);
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/user (POST)
// INSERT
router.post("/", async (req, res) => {
  try {
    clientMailerService = res.locals.clientMailerService;
    topic = res.locals.topicMailerservice;

    const user = new User({
      group: req.body.group,
      username: req.body.username,
      password: req.body.password,
      active: false,
      role: "",
    });

    // Salva i dati sul mongodb
    const result = await user.save();

    const searchTerm = `USERALL`;
    client.del(searchTerm);

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

// http://[HOST]:[PORT]/api/user/[ID_USER]
// Modifica
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id == undefined || id === "undefined") {
      res.status(400).json({
        message: "Error identify not found",
      });
      return;
    }

    // Aggiorna il documento su mongodb
    const user = await User.updateOne(
      { _id: id },
      {
        $set: {
          group: req.body.group,
          username: req.body.username,
          password: req.body.password,
          active: req.body.active,
          role: "",
        },
      }
    );

    const searchTerm = `USERBY${id}`;
    client.del(searchTerm);

    res.status(200).json({
      operation: "Update",
      status: "Success",
    });
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.remove({ _id: id });

    let searchTerm = `USERBY${id}`;
    client.del(searchTerm);
    searchTerm = `USER${id}`;
    client.del(searchTerm);

    res.status(200);
    res.json(user);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
});

module.exports = router;
