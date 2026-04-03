import { useId, type ReactNode } from "react";
import { useTheme, type ThemePreference } from "../theme/theme";

const OPTIONS: Array<{ value: ThemePreference; label: string; icon: ReactNode }> = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
        <circle cx="10" cy="10" r="3.2" fill="currentColor" />
        <path d="M10 1.8v2.2M10 16v2.2M1.8 10H4M16 10h2.2M3.5 3.5l1.6 1.6M14.9 14.9l1.6 1.6M16.5 3.5l-1.6 1.6M5.1 14.9l-1.6 1.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
        <path d="M13.8 2.3a7.7 7.7 0 1 0 3.9 13.7 7.8 7.8 0 0 1-7-12.3c.9-.7 2-1.2 3.1-1.4z" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
        <rect x="2.2" y="3" width="15.6" height="11.2" rx="1.6" stroke="currentColor" strokeWidth="1.4" fill="none" />
        <path d="M7.2 17h5.6M10 14.2V17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function ThemeControl({ className = "" }: { className?: string }) {
  const id = useId();
  const { preference, setPreference } = useTheme();

  return (
    <fieldset className={`theme-control ${className}`.trim()} aria-label="Theme">
      <legend className="theme-control__legend sr-only">Theme</legend>
      <div className="theme-control__track" role="radiogroup" aria-label="Theme">
        {OPTIONS.map((option) => {
          const inputId = `${id}-${option.value}`;
          const checked = preference === option.value;
          return (
            <label key={option.value} htmlFor={inputId} className="theme-control__option">
              <input
                id={inputId}
                className="theme-control__input"
                type="radio"
                name={id}
                value={option.value}
                checked={checked}
                onChange={() => setPreference(option.value)}
              />
              <span className="theme-control__label" aria-label={option.label} title={option.label}>
                <span className="theme-control__icon">{option.icon}</span>
                <span className="sr-only">{option.label}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
