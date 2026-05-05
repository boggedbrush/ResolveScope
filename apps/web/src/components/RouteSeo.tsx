import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { applyRouteSeo } from "../seo";

export function RouteSeo() {
  const location = useLocation();

  useEffect(() => {
    applyRouteSeo(location.pathname);
  }, [location.pathname]);

  return null;
}
