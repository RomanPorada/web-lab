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
  let mols = db.molecules || [];

  const { phases, molarMin, molarMax, q } = req.query;

  if (phases) {
    const wanted = phases.split(",").map(s => s.trim());
    mols = mols.filter(m => wanted.includes(m.phase));
  }
  if (molarMin) {
    const min = parseFloat(molarMin);
    mols = mols.filter(m => m.molarMass >= min);
  }
  if (molarMax) {
    const max = parseFloat(molarMax);
    mols = mols.filter(m => m.molarMass <= max);
  }
  if (q) {
    const qq = q.toLowerCase();
    mols = mols.filter(m =>
      (m.name && m.name.toLowerCase().includes(qq)) ||
      (m.formula && m.formula.toLowerCase().includes(qq))
    );
  }

  res.json({ data: mols });
});

// GET /molecules/:id
router.get("/:id", (req, res) => {
  const db = loadData();
  const mols = db.molecules || [];
  const item = mols.find(m => m.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ data: item });
});

module.exports = router;
