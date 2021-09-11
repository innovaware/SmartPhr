const express = require("express");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "No file uploaded",
      });
    } else {
      let result;

      let file = req.files.file;
      let typeDocument = req.body.typeDocument;
      let path = req.body.path.split("/");
      let name = req.body.name;
      
      result = {
        file: file,
        typeDocument: typeDocument,
        path: path,
        name: name
      };
      res.locals.result = result;
      // res.json({ result: result });

      next();

    }
  } catch (err) {
    res.status(500);
    res.json({ Error: err });
  }
});

module.exports = router;
