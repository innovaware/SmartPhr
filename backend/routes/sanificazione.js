const express = require("express");
const registroSanificazione = require("../models/registroSanificazione");

const router = express.Router();
const redisTimeCache = parseInt(process.env.REDISTTL) || 60;

router.get("/registro", async (req, res) => {
  try {
    const getData = () => {
      const query = [
        {
          '$lookup': {
            'from': 'user', 
            'localField': 'operatore', 
            'foreignField': '_id', 
            'as': 'userInfo'
          }
        }, {
          '$lookup': {
            'from': 'camera', 
            'localField': 'cameraId', 
            'foreignField': '_id', 
            'as': 'cameraInfo'
          }
        }
      ]
      // console.log("Query by piano: ", query);
      return registroSanificazione.aggregate(query);
    };

    const registro = await getData();
    res.status(200).json(registro);
    return;
  
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ Error: err });
  }
});


router.post("/registro", async (req, res) => {
  try {


    const registro = new registroSanificazione({
      cameraId: req.body.cameraId,
      stato: req.body.stato,
      data: req.body.data,
      note: req.body.note,
      firma: req.body.firma
    });

    const result = await registro.save();

    res.status(200);
    res.json(result);
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

module.exports = router;
