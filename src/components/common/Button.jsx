// src/components/common/Button.jsx
import Icons from "./Icons";

const Button = ({
  children, onClick, variant = "primary", icon, size = "md", disabled = false, style = {},
}) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontFamily: "inherit", fontWeight: 500, border: "none",
    cursor: disabled ? "not-allowed" : "pointer", borderRadius: 8,
    transition: "all .15s", opacity: disabled ? 0.5 : 1,
    ...style,
  };
  const sizes = {
    sm: { fontSize: 12, padding: "5px 10px" },
    md: { fontSize: 13.5, padding: "8px 16px" },
    lg: { fontSize: 15, padding: "10px 20px" },
  };
  const variants = {
    primary:   { background: "#4f6ef7", color: "#fff" },
    secondary: { background: "#f3f4f6", color: "#374151", border: "1px solid #e5e7eb" },
    danger:    { background: "#ef4444", color: "#fff" },
    ghost:     { background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb" },
    success:   { background: "#10b981", color: "#fff" },
  };

  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {icon && <Icons name={icon} size={14} color="currentColor" />}
      {children}
    </button>
  );
};

export default Button;