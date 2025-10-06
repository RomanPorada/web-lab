// =============== ATOMS =====================
function getAtoms() {
  return JSON.parse(localStorage.getItem("atoms") || "[]");
}
function saveAtoms(atoms) {
  localStorage.setItem("atoms", JSON.stringify(atoms));
}
function addAtom() {
  const atoms = getAtoms();
  const atom = {
    id: Date.now(),
    name: document.getElementById("atom-name").value,
    symbol: document.getElementById("atom-symbol").value,
    mass: parseFloat(document.getElementById("atom-mass").value),
    protons: parseInt(document.getElementById("atom-protons").value),
    neutrons: parseInt(document.getElementById("atom-neutrons").value),
    electrons: parseInt(document.getElementById("atom-electrons").value),
    state: document.getElementById("atom-state").value,
  };
  atoms.push(atom);
  saveAtoms(atoms);
  renderAtoms();
}

function renderAtoms() {
  const list = document.getElementById("atomsList");
  if (!list) return;
  let atoms = getAtoms();
  const search = document.getElementById("atom-search").value.toLowerCase();
  const sortBy = document.getElementById("atom-sort").value;

  atoms = atoms.filter(a =>
    a.name.toLowerCase().includes(search) ||
    a.symbol.toLowerCase().includes(search)
  );

  atoms.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "symbol") return a.symbol.localeCompare(b.symbol);
    if (sortBy === "mass") return a.mass - b.mass;
    return 0;
  });

  list.innerHTML = "";
  let total = 0;
  atoms.forEach(atom => {
    total += atom.mass;
    const li = document.createElement("li");
    li.innerHTML = `${atom.name} (${atom.symbol}) | Маса: ${atom.mass} 
      | p:${atom.protons}, n:${atom.neutrons}, e:${atom.electrons} | ${atom.state}
      <button onclick="deleteAtom(${atom.id})">❌</button>`;
    list.appendChild(li);
  });
  document.getElementById("totalMass").textContent = total.toFixed(2);
}

function deleteAtom(id) {
  let atoms = getAtoms();
  atoms = atoms.filter(a => a.id !== id);
  saveAtoms(atoms);
  renderAtoms();
}

// =============== MOLECULES =====================
function getMolecules() {
  return JSON.parse(localStorage.getItem("molecules") || "[]");
}
function saveMolecules(mols) {
  localStorage.setItem("molecules", JSON.stringify(mols));
}

function getFormula(atoms) {
  const counts = {};
  atoms.forEach(a => counts[a] = (counts[a] || 0) + 1);
  return Object.entries(counts).map(([k, v]) => k + (v > 1 ? v : "")).join("");
}

function renderAtomsForMolecule() {
  const container = document.getElementById("atomsContainer");
  if (!container) return;
  const atoms = getAtoms();
  container.innerHTML = "";
  atoms.forEach(atom => {
    const btn = document.createElement("button");
    btn.textContent = atom.symbol;
    btn.onclick = () => {
      selectedAtoms.push(atom.symbol);
      document.getElementById("chosenAtoms").textContent = selectedAtoms.join(" ");
    };
    container.appendChild(btn);
  });
}

let selectedAtoms = [];

function addMolecule() {
  const molecules = getMolecules();
  const name = document.getElementById("mol-name").value;
  const atoms = getAtoms();
  let totalMass = 0;

  selectedAtoms.forEach(sym => {
    const found = atoms.find(a => a.symbol === sym);
    if (found) totalMass += found.mass;
  });

  const molecule = {
    id: Date.now(),
    name,
    atoms: selectedAtoms.slice(),
    formula: getFormula(selectedAtoms),
    mass: totalMass,
  };
  molecules.push(molecule);
  saveMolecules(molecules);
  selectedAtoms = [];
  document.getElementById("chosenAtoms").textContent = "";
  renderMolecules();
}

function renderMolecules() {
  const list = document.getElementById("moleculesList");
  if (!list) return;
  let mols = getMolecules();
  const search = document.getElementById("mol-search").value.toLowerCase();
  const sortBy = document.getElementById("mol-sort").value;

  mols = mols.filter(m =>
    m.name.toLowerCase().includes(search) ||
    m.formula.toLowerCase().includes(search)
  );

  mols.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "formula") return a.formula.localeCompare(b.formula);
    if (sortBy === "mass") return a.mass - b.mass;
    return 0;
  });

  list.innerHTML = "";
  let total = 0;
  mols.forEach(m => {
    total += m.mass;
    const li = document.createElement("li");
    li.innerHTML = `${m.name} | Формула: ${m.formula} | Маса: ${m.mass.toFixed(2)}
      <button onclick="deleteMolecule(${m.id})">❌</button>`;
    list.appendChild(li);
  });
  document.getElementById("totalMolMass").textContent = total.toFixed(2);
}

function deleteMolecule(id) {
  let mols = getMolecules();
  mols = mols.filter(m => m.id !== id);
  saveMolecules(mols);
  renderMolecules();
}

// =============== INIT =====================
window.onload = () => {
  if (document.getElementById("atomsList")) renderAtoms();
  if (document.getElementById("moleculesList")) {
    renderAtomsForMolecule();
    renderMolecules();
  }
};
