const express = require("express");

const {
  convertCurrency
} = require("../controllers/currencyController");

const router = express.Router();

router.get("/convert", convertCurrency);

module.exports = router;