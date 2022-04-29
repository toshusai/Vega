import { Ref } from "nuxt/dist/app/compat/capi";
interface DD {
  key: string;
  payload: string;
}

export default function () {
  const dad = useState<DD>("darg-and-drop", () => ({ key: "", payload: null }));
  const set = (dad: Ref<DD>) => {
    return (key: string, payload: string) => {
      dad.value.key = key;
      dad.value.payload = payload;
    };
  };
  const startDad = (dad: Ref<DD>) => {
    return (e: MouseEvent, key: string, payload: string) => {
      dad.value.key = key;
      dad.value.payload = payload;
      const target = e.target as HTMLElement;
      const tmp = target.cloneNode(true) as HTMLElement;
      const wrap = document.createElement("div");
      wrap.style.position = "absolute";
      wrap.style.pointerEvents = "none";
      wrap.appendChild(tmp);
      document.body.appendChild(wrap);
      const mousemove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        wrap.style.left = `${clientX}px`;
        wrap.style.top = `${clientY}px`;
      };
      window.addEventListener("mousemove", mousemove);

      const mouseup = () => {
        dad.value.key = "";
        dad.value.payload = null;
        wrap.remove();
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      };

      window.addEventListener("mouseup", mouseup);
      e.preventDefault();
    };
  };
  return {
    dad,
    set: set(dad),
    startDad: startDad(dad),
  };
}
