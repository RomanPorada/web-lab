const API_URL = window.location.origin;
let atomSequence = [];
let atomsCache = [];
let moleculesCache = [];

document.addEventListener("DOMContentLoaded", () => {
    loadAtoms();
    loadMolecules();

    document.getElementById("atomForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const atomData = {
            name: document.getElementById("atomName").value,
            symbol: document.getElementById("atomSymbol").value,
            mass: parseInt(document.getElementById("atomMass").value),
            protons: parseInt(document.getElementById("atomProtons").value),
            neutrons: parseInt(document.getElementById("atomNeutrons").value),
            electrons: parseInt(document.getElementById("atomElectrons").value),
            state: document.getElementById("atomState").value,
        };

        await fetch(`${API_URL}/atoms`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(atomData)
        });
        e.target.reset();
        loadAtoms();
    });

    document.getElementById("sortAtoms").addEventListener("change", renderAtoms);
    document.getElementById("searchAtoms").addEventListener("input", renderAtoms);
    document.getElementById("sortMolecules").addEventListener("change", renderMolecules);
    document.getElementById("searchMolecules").addEventListener("input", renderMolecules);
});

async function loadAtoms() {
    const res = await fetch(`${API_URL}/atoms`);
    atomsCache = await res.json();
    renderAtoms();
}

function renderAtoms() {
    let atoms = [...atomsCache];
    const search = document.getElementById("searchAtoms").value.toLowerCase();
    const sortBy = document.getElementById("sortAtoms").value;

    if (search) {
        atoms = atoms.filter(a => a.name.toLowerCase().includes(search) || a.symbol.toLowerCase().includes(search));
    }

    if (sortBy) {
        atoms.sort((a, b) => {
            if (sortBy === "mass") return a.mass - b.mass;
            return a[sortBy].localeCompare(b[sortBy]);
        });
    }

    const list = document.getElementById("atomsList");
    list.innerHTML = "";

    atoms.forEach(atom => {
        const div = document.createElement("div");
        div.textContent = `${atom.name} (${atom.symbol}), Mass:${atom.mass}, P:${atom.protons}, N:${atom.neutrons}, E:${atom.electrons}, State:${atom.state}`;
        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.onclick = () => deleteAtom(atom.id);
        div.appendChild(delBtn);
        list.appendChild(div);
    });

    const total = atoms.reduce((sum, a) => sum + a.mass, 0);
    document.getElementById("atomsTotal").textContent = `Загальна маса: ${total}`;

    const addArea = document.getElementById("atomsForMolecule");
    addArea.innerHTML = "";
    atoms.forEach(atom => {
        const atomDiv = document.createElement("div");
        const plusBtn = document.createElement("button");
        plusBtn.textContent = atom.symbol + " +";
        plusBtn.onclick = () => addAtomToSequence(atom.symbol);
        atomDiv.appendChild(plusBtn);

        const counter = document.createElement("span");
        counter.id = "counter_" + atom.symbol;
        counter.style.marginLeft = "10px";
        atomDiv.appendChild(counter);

        addArea.appendChild(atomDiv);
    });
}

async function loadMolecules() {
    const res = await fetch(`${API_URL}/molecules`);
    moleculesCache = await res.json();
    renderMolecules();
}

function renderMolecules() {
    let molecules = [...moleculesCache];
    const search = document.getElementById("searchMolecules").value.toLowerCase();
    const sortBy = document.getElementById("sortMolecules").value;

    if (search) {
        molecules = molecules.filter(m => m.name.toLowerCase().includes(search) || m.formula.toLowerCase().includes(search));
    }

    if (sortBy) {
        molecules.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }

    const list = document.getElementById("moleculesList");
    list.innerHTML = "";

    molecules.forEach(molecule => {
        const div = document.createElement("div");
        div.textContent = `${molecule.name} (${molecule.formula})`;
        const delBtn = document.createElement("button");
        delBtn.textContent = "❌";
        delBtn.onclick = () => deleteMolecule(molecule.id);
        div.appendChild(delBtn);
        list.appendChild(div);
    });

    document.getElementById("moleculesTotal").textContent = `Кількість молекул: ${molecules.length}`;
}

function addAtomToSequence(symbol) {
    atomSequence.push(symbol);
    updateSequence();
}

function updateSequence() {
    const container = document.getElementById("atomSequence");
    container.textContent = atomSequence.join(", ");

    document.querySelectorAll("[id^='counter_']").forEach(c => c.textContent = "");

    let prev = null;
    let count = 0;
    for (let i = 0; i < atomSequence.length; i++) {
        if (atomSequence[i] === prev) {
            count++;
        } else {
            if (prev) {
                document.getElementById("counter_" + prev).textContent = count;
            }
            prev = atomSequence[i];
            count = 1;
        }
    }
    if (prev) {
        document.getElementById("counter_" + prev).textContent = count;
    }
}

function sequenceToFormula(seq) {
    let result = "";
    let prev = null;
    let count = 0;

    function flush() {
        if (prev) {
            result += prev + (count > 1 ? count : "");
        }
    }

    for (let i = 0; i < seq.length; i++) {
        if (seq[i] === prev) {
            count++;
        } else {
            flush();
            prev = seq[i];
            count = 1;
        }
    }
    flush();
    return result;
}

async function combineMolecule() {
    if (atomSequence.length === 0) return;
    const formula = sequenceToFormula(atomSequence);
    const name = prompt("Введіть назву молекули:", formula);

    await fetch(`${API_URL}/molecules`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({formula, name})
    });
    atomSequence = [];
    updateSequence();
    loadMolecules();
}

async function deleteAtom(id) {
    await fetch(`${API_URL}/atoms/${id}`, {method: "DELETE"});
    loadAtoms();
}

async function deleteMolecule(id) {
    await fetch(`${API_URL}/molecules/${id}`, {method: "DELETE"});
    loadMolecules();
}
