import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, clearCart } from "../../redux/actions";
import "./Header.css";

export default function Header() {
  const loc = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((s) => s.cart || {});
  const user = useSelector((s) => s.user);
  const total = Object.values(cart).reduce((sum, it) => sum + (it.quantity || 0), 0);

  const isAuthPage = loc.pathname === "/login" || loc.pathname === "/register";

  const handleLogout = () => {
    // Persist current cart explicitly under the user's key to avoid race conditions
    try {
      if (user && user.id) {
        const cartKey = `redux_cart_${user.id}`;
        localStorage.setItem(cartKey, JSON.stringify(cart || {}));
      }
    } catch (e) {
      // ignore
    }

    // Clear Redux user + cart state for UI
    dispatch(logoutUser());
    dispatch(clearCart());

    // Remove stored current-user marker
    localStorage.removeItem("redux_user");
    // remove legacy keys if present
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");

    // Redirect to login
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="container header-inner">
        <div className="brand">
          <div className="brand-title">AtomLab</div>
          <div className="brand-sub">Атоми & Молекули</div>
        </div>

        <nav className="nav">
          {!isAuthPage && user ? (
            <>
              <Link className={loc.pathname === "/" ? "active" : ""} to="/">Головна</Link>
              <Link className={loc.pathname.startsWith("/catalog") ? "active" : ""} to="/catalog">Каталог</Link>
              <Link className={loc.pathname === "/cart" ? "active" : ""} to="/cart">🛒 Cart {total > 0 && <span className="cart-badge">{total}</span>}</Link>
              <div className="user-info">
                <span className="user-email">{user.email}</span>
                <button className="logout-btn" onClick={handleLogout}>Вийти</button>
              </div>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
