import React, { useState } from "react";
import "./Header.css";

const Header = ({ onCreateClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-left">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          alt="logo"
          className="logo"
        />
        <h1 className="logo-text">AtomLab</h1>
      </div>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <a href="#home" className="nav-link">Головна</a>
        <a href="#atoms" className="nav-link">Атоми</a>
        <a href="#molecules" className="nav-link">Молекули</a>
      </nav>

      <button className="create-btn" onClick={onCreateClick}>
        Створити
      </button>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>
    </header>
  );
};

export default Header;
