import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeControl } from "./ThemeControl";

export interface MobileNavItem {
  label: string;
  href?: string;
  to?: string;
}

interface MobileNavMenuProps {
  items: MobileNavItem[];
}

export function MobileNavMenu({ items }: MobileNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="nav__mobile">
      <button
        type="button"
        className={`nav__menu-toggle${isOpen ? " nav__menu-toggle--open" : ""}`}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls={menuId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="nav__menu-bar" aria-hidden="true" />
        <span className="nav__menu-bar" aria-hidden="true" />
        <span className="nav__menu-bar" aria-hidden="true" />
      </button>

      <div
        id={menuId}
        className={`nav__mobile-menu${isOpen ? " nav__mobile-menu--open" : ""}`}
        hidden={!isOpen}
      >
        <nav className="nav__mobile-links" aria-label="Mobile navigation">
          {items.map((item) =>
            item.to ? (
              <Link key={item.label} to={item.to} onClick={closeMenu}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            )
          )}
        </nav>
        <div className="nav__mobile-actions">
          <Link to="/dashboard" className="btn btn--primary nav__mobile-cta" onClick={closeMenu}>
            Try the Demo
          </Link>
          <ThemeControl className="nav__mobile-theme" />
        </div>
      </div>
    </div>
  );
}
