from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__)

atoms = []
molecules = []


@app.route('/')
def home():
    return """
    <h2>Виберіть сторінку:</h2>
    <ul>
        <li><a href="/atoms">Атоми</a></li>
        <li><a href="/molecules">Молекули</a></li>
    </ul>
    """


# ---------- HTML сторінки ----------
@app.route('/atoms')
def atoms_page():
    return send_from_directory('templates', 'atoms.html')


@app.route('/molecules')
def molecules_page():
    return send_from_directory('templates', 'molecules.html')


# ---------- API для атомів ----------
@app.route('/get_atoms')
def get_atoms():
    return jsonify(atoms)


@app.route('/add_atom', methods=['POST'])
def add_atom():
    data = request.json
    atom = {
        "id": len(atoms) + 1,
        "name": data.get("name", ""),
        "symbol": data.get("symbol", ""),
        "mass": float(data.get("mass", 0)),
        "protons": int(data.get("protons", 0)),
        "neutrons": int(data.get("neutrons", 0)),
        "electrons": int(data.get("electrons", 0)),
        "state": data.get("state", "Stable")
    }
    atoms.append(atom)
    return jsonify(atom)


@app.route('/delete_atom/<int:atom_id>', methods=['DELETE'])
def delete_atom(atom_id):
    global atoms
    atoms = [a for a in atoms if a['id'] != atom_id]
    return jsonify(success=True)


# ---------- API для молекул ----------
def get_formula(atom_list):
    counts = {}
    for atom in atom_list:
        counts[atom['symbol']] = counts.get(atom['symbol'], 0) + 1
    return "".join(f"{k}{v if v > 1 else ''}" for k, v in counts.items())


@app.route('/get_molecules')
def get_molecules():
    return jsonify(molecules)


@app.route('/add_molecule', methods=['POST'])
def add_molecule():
    data = request.json
    name = data.get("name", "")
    atom_list = data.get("atoms", [])

    molecule_atoms = []
    molecular_mass = 0.0

    for symbol in atom_list:
        atom = next((a for a in atoms if a['symbol'] == symbol), None)
        if atom:
            molecule_atoms.append(atom)
            molecular_mass += float(atom['mass'])

    molecule = {
        "id": len(molecules) + 1,
        "name": name,
        "atoms": molecule_atoms,
        "formula": get_formula(molecule_atoms),
        "mass": molecular_mass
    }

    molecules.append(molecule)
    return jsonify(molecule)


@app.route('/delete_molecule/<int:molecule_id>', methods=['DELETE'])
def delete_molecule(molecule_id):
    global molecules
    molecules = [m for m in molecules if m['id'] != molecule_id]
    return jsonify(success=True)


if __name__ == '__main__':
    app.run(debug=True)
