import { createContext, useContext, useEffect, useMemo, useState } from "react";

const RouterContext = createContext(null);

export function normalizePath(pathname) {
  const clean = pathname.replace(/\/+$/, "");
  return clean || "/";
}

export function SpaRouter({ children }) {
  const [location, setLocation] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setLocation(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (to, options = {}) => {
    const next = normalizePath(to);
    if (options.replace) window.history.replaceState({}, "", next);
    else window.history.pushState({}, "", next);
    setLocation(next);
  };

  const value = useMemo(() => ({ location, navigate }), [location]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useNavigate() {
  return useContext(RouterContext).navigate;
}

export function useLocation() {
  return useContext(RouterContext).location;
}

export function Link({ to, children, ...props }) {
  const navigate = useNavigate();
  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

export function NavLink({ to, children, className, ...props }) {
  const location = useLocation();
  const active = normalizePath(location) === normalizePath(to);
  const resolvedClassName = typeof className === "function" ? className({ isActive: active }) : className;
  return <Link to={to} className={resolvedClassName} aria-current={active ? "page" : undefined} {...props}>{children}</Link>;
}

export function Navigate({ to, replace = false }) {
  const navigate = useNavigate();
  useEffect(() => navigate(to, { replace }), [navigate, replace, to]);
  return null;
}

export function Outlet({ children }) {
  return children;
}
