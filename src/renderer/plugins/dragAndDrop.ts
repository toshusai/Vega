import { addDragEventOnce } from "./mouse";

export class DragAndDrop {
  dragging: any = null;
  public static main: DragAndDrop;
  constructor() {
    DragAndDrop.main = this;
  }

  public static init() {
    DragAndDrop.main = new DragAndDrop();
  }
}

export default function dragAndDrop(el: HTMLElement, object: any) {
  DragAndDrop.main.dragging = object;
  const div = document.createElement("div");
  div.style.opacity = "0.8";
  div.style.position = "fixed";
  div.style.zIndex = "100";
  const temp = el.cloneNode(true);
  div.append(temp);
  document.body.append(div);
  addDragEventOnce(
    (e: MouseEvent) => {
      div.style.left = e.pageX + "px";
      div.style.top = e.pageY + "px";
    },
    (_: MouseEvent) => {
      div.remove();
    }
  );
}
