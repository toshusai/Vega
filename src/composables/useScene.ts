import { Ref } from "nuxt/dist/app/compat/capi";
import * as THREE from "three";

export interface State {
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  renderer?: THREE.WebGLRenderer;
}

export function useScene() {
  const scene = useState<State>("scene", () => {
    return {};
  });

  onMounted(() => {
    scene.value.scene = new THREE.Scene();
    scene.value.camera = new THREE.OrthographicCamera(0, 0, 200, 200);
  });

  return {
    scene,
    setRenderer: ((state: Ref<State>) => {
      return (canvas: HTMLCanvasElement) => {
        const renderer = new THREE.WebGLRenderer({
          canvas,
        });
        state.value.renderer = renderer;
      };
    })(scene),
    update: ((state: Ref<State>) => {
      return () => {
        state.value.renderer.render(state.value.scene, state.value.camera);
      };
    })(scene),
  };
}
