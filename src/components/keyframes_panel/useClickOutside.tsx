import { useState } from "react";


export function useClickOutside(ref: React.RefObject<HTMLDivElement>) {
    const [show, setShow] = useState(false);
    const handleClick = () => {
        setShow(!show);
        const handleMouseDown = (e: MouseEvent) => {
            if (ref.current && ref.current.contains(e.target as Node)) {
                return;
            }
            setShow(false);
            window.removeEventListener("mousedown", handleMouseDown, {
                capture: true,
            });
        };
        window.addEventListener("mousedown", handleMouseDown, {
            capture: true,
        });
    };
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const onMouseLeave = () => {
        const id = setTimeout(() => {
            if (timeoutId) {
                setShow(false);
            }
        }, 100);
        setTimeoutId(id);
    };
    return { show, setShow, handleClick, onMouseLeave };
}
