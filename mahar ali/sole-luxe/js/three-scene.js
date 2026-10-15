import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_URL = "./assets/models/sole-luxe-shoe.glb";

export function createShoeScene() {
  const canvas = document.querySelector("#shoe-canvas");
  const sceneElement = canvas.closest(".hero-scene");
  const loaderMessage = sceneElement.querySelector(".scene-loading");
  const fallbackImage = sceneElement.querySelector(".hero-fallback");
  const notice = sceneElement.querySelector(".model-notice");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.2, 9);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  } catch (error) {
    console.error("Sole Luxe 3D renderer could not start:", error);
    loaderMessage.hidden = true;
    notice.hidden = false;
    notice.textContent = "3D preview is unavailable in this browser. Add a compatible GLB at assets/models/sole-luxe-shoe.glb.";
    return { focus: () => {} };
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  scene.add(new THREE.HemisphereLight(0xc8e3ff, 0x171b25, 2.1));
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const key = new THREE.DirectionalLight(0xe5f2ff, 4.4);
  key.position.set(3, 5, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -5;
  key.shadow.camera.right = 5;
  key.shadow.camera.top = 5;
  key.shadow.camera.bottom = -5;
  key.shadow.bias = -0.0002;
  scene.add(key);
  const blueRim = new THREE.PointLight(0x42a5ff, 34, 15, 2);
  blueRim.position.set(-4, 1.4, 2);
  scene.add(blueRim);
  const silverRim = new THREE.PointLight(0xdce3eb, 20, 13, 2);
  silverRim.position.set(2, -2, -2);
  scene.add(silverRim);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x10151d, metalness: 0.66, roughness: 0.25 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.3;
  floor.receiveShadow = true;
  scene.add(floor);

  const reflectionLight = new THREE.Mesh(
    new THREE.CircleGeometry(2.45, 64),
    new THREE.MeshBasicMaterial({ color: 0x377bb3, transparent: true, opacity: 0.12 })
  );
  reflectionLight.rotation.x = -Math.PI / 2;
  reflectionLight.position.set(0, -1.27, 0);
  scene.add(reflectionLight);

  const shoeRoot = new THREE.Group();
  scene.add(shoeRoot);
  const particles = new THREE.Group();
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x9dcbff, size: 0.025, transparent: true, opacity: 0.58, sizeAttenuation: true
  });
  const particlePositions = new Float32Array(150 * 3);
  for (let i = 0; i < 150; i += 1) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 12;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  particles.add(new THREE.Points(particleGeometry, particleMaterial));
  scene.add(particles);

  let hasModel = false;
  let targetX = 0;
  let targetY = 0;
  let scrollRotation = 0;
  let focusTarget = 0;
  let frame = 0;
  let pointerDown = false;
  let lastPointerX = 0;

  function resize() {
    const bounds = sceneElement.getBoundingClientRect();
    const width = Math.max(bounds.width, 1);
    const height = Math.max(bounds.height, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 580 ? 10.6 : 9;
    camera.updateProjectionMatrix();
    if (reducedMotion.matches) renderer.render(scene, camera);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(sceneElement);
  resize();

  new GLTFLoader().load(
    MODEL_URL,
    (gltf) => {
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const largestDimension = Math.max(size.x, size.y, size.z);
      if (!Number.isFinite(largestDimension) || largestDimension === 0) {
        notice.hidden = false;
        notice.textContent = "The supplied shoe model is empty. Use a valid GLB at assets/models/sole-luxe-shoe.glb.";
        loaderMessage.hidden = true;
        return;
      }
      model.scale.setScalar(4.5 / largestDimension);
      const centeredBounds = new THREE.Box3().setFromObject(model);
      const center = centeredBounds.getCenter(new THREE.Vector3());
      model.position.sub(center);
      model.position.y += floor.position.y + 0.06 - centeredBounds.min.y;
      model.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = true;
          object.receiveShadow = true;
          if (object.material) {
            object.material.envMapIntensity = 1.2;
            object.material.needsUpdate = true;
          }
        }
      });
      shoeRoot.add(model);
      const reflection = model.clone(true);
      reflection.position.y = (floor.position.y * 2) - model.position.y;
      reflection.scale.y *= -1;
      reflection.traverse((object) => {
        if (object.isMesh) {
          object.castShadow = false;
          object.receiveShadow = false;
          const makeReflectiveMaterial = (material) => {
            const reflectedMaterial = material.clone();
            reflectedMaterial.transparent = true;
            reflectedMaterial.opacity = Math.min(reflectedMaterial.opacity, 0.11);
            reflectedMaterial.depthWrite = false;
            reflectedMaterial.roughness = Math.max(reflectedMaterial.roughness ?? 0.5, 0.24);
            return reflectedMaterial;
          };
          object.material = Array.isArray(object.material)
            ? object.material.map(makeReflectiveMaterial)
            : makeReflectiveMaterial(object.material);
        }
      });
      shoeRoot.add(reflection);
      hasModel = true;
      fallbackImage.classList.add("is-hidden");
      loaderMessage.hidden = true;
      canvas.classList.add("is-ready");
      if (reducedMotion.matches) renderer.render(scene, camera);
    },
    undefined,
    (error) => {
      console.warn(`Sole Luxe 3D model could not be loaded from ${MODEL_URL}:`, error);
      loaderMessage.hidden = true;
      notice.hidden = false;
    }
  );

  function onPointerMove(event) {
    const bounds = sceneElement.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    targetY = x * 0.36;
    targetX = y * 0.16;
    if (pointerDown && hasModel) {
      shoeRoot.rotation.y += (event.clientX - lastPointerX) * 0.008;
      lastPointerX = event.clientX;
    }
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    lastPointerX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointerup", () => { pointerDown = false; });
  canvas.addEventListener("pointercancel", () => { pointerDown = false; });
  sceneElement.addEventListener("pointerleave", () => { targetX = 0; targetY = 0; });

  function onScroll() {
    const bounds = sceneElement.getBoundingClientRect();
    const progress = THREE.MathUtils.clamp((window.innerHeight - bounds.top) / (window.innerHeight + bounds.height), 0, 1);
    scrollRotation = progress * Math.PI * 1.2;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function animate() {
    frame = reducedMotion.matches ? 0 : window.requestAnimationFrame(animate);
    const time = reducedMotion.matches ? 0 : performance.now() * 0.00035;
    if (hasModel) {
      shoeRoot.rotation.x += (targetX - shoeRoot.rotation.x) * 0.04;
      shoeRoot.rotation.y += ((reducedMotion.matches ? 0 : scrollRotation + targetY) - shoeRoot.rotation.y) * 0.035;
      shoeRoot.position.y += ((reducedMotion.matches ? 0 : Math.sin(time * 2) * 0.1) - shoeRoot.position.y) * 0.04;
      shoeRoot.position.x += (focusTarget - shoeRoot.position.x) * 0.055;
    }
    particles.rotation.y = reducedMotion.matches ? 0 : time * 0.16;
    renderer.render(scene, camera);
  }
  animate();
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      window.cancelAnimationFrame(frame);
      frame = 0;
      renderer.render(scene, camera);
    } else if (!frame) {
      animate();
    }
  });

  return {
    focus() { focusTarget = focusTarget === 0 ? 0.45 : 0; },
    destroy() {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      renderer.dispose();
    }
  };
}
