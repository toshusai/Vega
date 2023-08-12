import { wait } from "../src/utils/wait";

export class DummyClick {
  el: HTMLElement;
  static makeRippleBase() {
    const ripple = document.createElement("div");
    ripple.style.position = "absolute";
    ripple.style.width = "8px";
    ripple.style.height = "8px";
    ripple.style.zIndex = "100000";
    ripple.style.borderRadius = "50%";
    ripple.style.pointerEvents = "none";
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.opacity = "1";
    ripple.style.transition = "0.4s ease-out";
    return ripple;
  }

  static async makeRippleDom(x: number, y: number, color?: string) {
    const ripple = DummyClick.makeRippleBase();
    ripple.style.backgroundColor = color ?? "#ff4242";
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;
    document.body.appendChild(ripple);
    await wait(1);
    ripple.style.width = "32px";
    ripple.style.height = "32px";
    ripple.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 400);
  }
  constructor() {
    this.el = document.createElement("div");
    this.el.style.position = "absolute";
    this.el.style.top = "0";
    this.el.style.left = "0";
    this.el.style.width = "4px";
    this.el.style.height = "4px";
    this.el.style.backgroundColor = "#ffffff";
    this.el.style.border = "1px solid #000000";
    this.el.style.boxShadow = "0px 0px 4px 0px #000000";
    this.el.style.zIndex = "100000";
    this.el.style.borderRadius = "50%";
    this.el.style.pointerEvents = "none";
    this.el.style.transform = "translate(-50%, -50%)";
    this.el.style.visibility = "hidden";
    document.body.appendChild(this.el);
  }
  async down(el: Element) {
    await wait(10);
    this.el.style.visibility = "visible";
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    this.el.style.left = `${cx}px`;
    this.el.style.top = `${cy}px`;
    el.dispatchEvent(
      new MouseEvent("mousedown", {
        bubbles: true,
        clientX: cx,
        clientY: cy,
      })
    );
    await DummyClick.makeRippleDom(cx, cy);
    return {
      x: cx,
      y: cy,
    };
  }
  async move(sx: number, sy: number, dx: number, dy: number, ms: number) {
    this.el.style.visibility = "visible";
    const length = Math.sqrt((dx - sx) ** 2 + (dy - sy) ** 2);
    const stepTime = ms / length;
    for (let i = 0; i < length; i++) {
      await wait(stepTime);
      const x = sx + ((dx - sx) / length) * i;
      const y = sy + ((dy - sy) / length) * i;
      this.el.style.left = `${x}px`;
      this.el.style.top = `${y}px`;

      const el = document.elementFromPoint(x, y);
      if (el) {
        el.dispatchEvent(
          new MouseEvent("mousemove", {
            bubbles: true,
            clientX: x,
            clientY: y,
          })
        );
      }
    }
  }
  async up(el: Element) {
    this.el.style.visibility = "visible";
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    this.el.style.left = `${cx}px`;
    this.el.style.top = `${cy}px`;
    el.dispatchEvent(
      new MouseEvent("mouseup", {
        bubbles: true,
        clientX: cx,
        clientY: cy,
      })
    );
    await DummyClick.makeRippleDom(cx, cy, "#54ff54");
  }
  async upFromPos(x: number, y: number) {
    this.el.style.visibility = "visible";
    await wait(10);
    this.el.style.left = `${x}px`;
    this.el.style.top = `${y}px`;
    const el = document.elementFromPoint(x, y);
    if (el) {
      el.dispatchEvent(
        new MouseEvent("mouseup", {
          bubbles: true,
          clientX: x,
          clientY: y,
        })
      );
      await DummyClick.makeRippleDom(x, y, "#54ff54");
    }
  }

  destory() {
    document.body.removeChild(this.el);
  }
}
