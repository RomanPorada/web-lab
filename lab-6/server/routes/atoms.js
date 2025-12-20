const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const DATA_FILE = path.join(__dirname, "../data/data.json");

function loadData() {
  const raw = fs.readFileSync(DATA_FILE);
  return JSON.parse(raw);
}

router.get("/", (req, res) => {
  const db = loadData();
  let atoms = db.atoms || [];

  const { types, massMin, massMax, q } = req.query;

  if (types) {
    const wanted = types.split(",").map(s => s.trim());
    atoms = atoms.filter(a => wanted.includes(a.atomType));
  }
  if (massMin) {
    const min = parseFloat(massMin);
    atoms = atoms.filter(a => a.mass >= min);
  }
  if (massMax) {
    const max = parseFloat(massMax);
    atoms = atoms.filter(a => a.mass <= max);
  }
  if (q) {
    const qq = q.toLowerCase();
    atoms = atoms.filter(a =>
      (a.name && a.name.toLowerCase().includes(qq)) ||
      (a.symbol && a.symbol.toLowerCase().includes(qq))
    );
  }

  res.json({ data: atoms });
});

router.get("/:id", (req, res) => {
  const db = loadData();
  const atoms = db.atoms || [];
  const item = atoms.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ data: item });
});

module.exports = router;
