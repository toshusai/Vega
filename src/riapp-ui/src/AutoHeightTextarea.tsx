import { forwardRef, useEffect, useRef } from "react";
import { mergeRefs } from "./mergeRefs";
import { VTextareaProps, VTextarea } from "./VTextarea";

export const AutoHeightTextarea = forwardRef(function AutoHeightTextarea(
  props: VTextareaProps,
  forwardRef: any
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useAutoHeight(ref);
  useResizeObserver(ref, () => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height =
      ref.current.scrollHeight + BORDER_AND_PADDING + "px";
  });
  return (
    <VTextarea
      {...props}
      ref={mergeRefs<HTMLTextAreaElement>([ref, forwardRef])}
    />
  );
});

export function useResizeObserver<T extends Element>(
  ref: React.RefObject<T>,
  cb: (entry: ResizeObserverEntry[]) => void
) {
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      cb(entries);
    });
    const el = ref.current;
    if (!el) return;
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [ref]);
}
const BORDER_AND_PADDING = 6;

export function useAutoHeight(ref: React.RefObject<HTMLTextAreaElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + BORDER_AND_PADDING + "px";
    };
    el.addEventListener("input", resize);
    resize();
    return () => el.removeEventListener("input", resize);
  }, [ref]);
}
