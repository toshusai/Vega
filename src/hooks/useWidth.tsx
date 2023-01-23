import { useEffect, useRef, useState } from "react";

export function useWidth(deps: any[] = []) {
  const [width, setWidth] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const handleResize = () => {
      setWidth(ref.current!.clientWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.clientWidth);
  }, [ref, deps]);
  return [width, ref] as const;
}
