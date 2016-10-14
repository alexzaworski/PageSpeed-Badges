"use strict";

const psi = require("psi");
const express = require("express");
const axios = require("axios");

const app = express();
app.set("port", (process.env.PORT || 3000));

app.get("/", function (req, res) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Content-Type", "image/svg+xml;charset=utf-8");

  const url = req.query.url;
  const strat = req.query.strat || "mobile";
  const shieldsAPI = "https://img.shields.io/badge";
  const stratLabel = req.query.showStratLabel ? ` (${strat})` : "";
  let psiOpts = {
    strategy: strat
  }
  if (process.env.googleKey) {
    psiOpts.key = process.env.googleKey;
  } else {
    psiOpts.nokey = true;
  }
  psi(url, psiOpts).then(response => {
    const speed = response.ruleGroups.SPEED.score;
    const color = getColor(speed);
    axios.get(`${shieldsAPI}/PageSpeed-${speed}${stratLabel}-${color}.svg`).then( r => {
      res.send(r.data);
    }, err => {
      console.log("Shields error", err);
      res.sendStatus(500);
    });
  }, err => {
    console.log("PSI error", err);
    axios.get(`${shieldsAPI}/PageSpeed-ERR-red.svg`).then( r => {
      res.send(r.data);
    }, err => {
      console.log("Shields error", err);
      res.sendStatus(500);
    });
  });
});

const getColor = (speed) => {
  if (speed >= 95) {
    return "brightgreen";
  } else if (speed >=90) {
    return "green";
  } else if (speed >= 80) {
    return "yellowgreen";
  } else if (speed >= 70) {
    return "yellow";
  } else if (speed >= 60) {
    return "orange";
  } else {
    return "red";
  }
};

app.listen(app.get('port'), function() {
  console.log('Running on port', app.get('port'));
});
