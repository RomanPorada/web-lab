import React, { useState } from "react";
import "./Home.css";
import { FaAtom } from "react-icons/fa";
import { GiMolecule } from "react-icons/gi";

export default function Home() {
  const [view, setView] = useState("atoms");

  const atoms = [
    { name: "Гідроген", symbol: "H", mass: 1.008 },
    { name: "Гелій", symbol: "He", mass: 4.0026 },
    { name: "Літій", symbol: "Li", mass: 6.94 },
    { name: "Бор", symbol: "B", mass: 10.81 },
    { name: "Карбон", symbol: "C", mass: 12.011 },
    { name: "Нітроген", symbol: "N", mass: 14.007 },
    { name: "Оксиген", symbol: "O", mass: 15.999 },
    { name: "Флуор", symbol: "F", mass: 18.998 },
    { name: "Неон", symbol: "Ne", mass: 20.180 },
    { name: "Натрій", symbol: "Na", mass: 22.990 },
  ];

  const molecules = [
    { name: "Вода", formula: "H₂O" },
    { name: "Вуглекислий газ", formula: "CO₂" },
    { name: "Кисень", formula: "O₂" },
    { name: "Озон", formula: "O₃" },
    { name: "Метан", formula: "CH₄" },
    { name: "Етанол", formula: "C₂H₅OH" },
    { name: "Сахароза", formula: "C₁₂H₂₂O₁₁" },
    { name: "Аміак", formula: "NH₃" },
    { name: "Глюкоза", formula: "C₆H₁₂O₆" },
    { name: "Сірководень", formula: "H₂S" },
  ];

  const list = view === "atoms" ? atoms : molecules;

  return (
    <div className="main-container">
      <h1 className="main-title">
        Лабораторна №6 — <span>Атоми та Молекули</span>
      </h1>

      <div className="toggle-buttons">
        <button
          className={view === "atoms" ? "active" : ""}
          onClick={() => setView("atoms")}
        >
          <FaAtom className="icon" /> Атоми
        </button>
        <button
          className={view === "molecules" ? "active" : ""}
          onClick={() => setView("molecules")}
        >
          <GiMolecule className="icon" /> Молекули
        </button>
      </div>

      <div className="cards">
        {view === "atoms"
          ? list.map((atom, i) => (
              <div className="card" key={i}>
                <h3>{atom.symbol}</h3>
                <p>{atom.name}</p>
                <p>Атомна маса: {atom.mass}</p>
              </div>
            ))
          : list.map((mol, i) => (
              <div className="card" key={i}>
                <h3>{mol.formula}</h3>
                <p>{mol.name}</p>
              </div>
            ))}
      </div>
    </div>
  );
}
