import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / (window.innerHeight + 300),
  1,
  100
);
// Adjust the camera position to provide more height
camera.position.set(-25, -20, -35);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, (window.innerHeight + 300));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.domElement.classList.add("hero__canvas");
document.body.appendChild(renderer.domElement);

// Enable OrbitControls with damping, disable panning and zooming
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable damping (inertia)
controls.dampingFactor = 0.05; // Damping factor
controls.enablePan = false; // Disable panning
controls.enableZoom = false; // Disable zooming
controls.minPolarAngle = Math.PI / 2; // Lock vertical rotation
controls.maxPolarAngle = Math.PI / 2; // Lock vertical rotation

// Create a sphere geometry
const sphereGeometry = new THREE.SphereGeometry(12, 64, 64);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

// Use MeshSurfaceSampler to sample points on the sphere's surface
let sampler = new MeshSurfaceSampler(sphereMesh).build();

// Particle system logic remains unchanged
let pointsGeometry = new THREE.BufferGeometry();
const vertices = [];
const velocities = [];
const originalPositions = [];
const tempPosition = new THREE.Vector3();
const particleCount = 99000; // Adjust this value to control density

// Function to transform sphere into particles
let points;

function transformMesh() {
  // Loop to sample a coordinate for each point
  for (let i = 0; i < particleCount; i++) {
    // Sample a random position on the sphere surface
    sampler.sample(tempPosition);

    // Push the scaled coordinates into the array
    vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
    originalPositions.push(tempPosition.x, tempPosition.y, tempPosition.z); // Store scaled positions
    velocities.push(0, 0, 0); // Initialize velocities to zero
  }

  // Define all points positions from the previously created array
  pointsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  pointsGeometry.needsUpdate = true;

  // Define the material of the points
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x00308f,
    size: 0.2,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    sizeAttenuation: true,
    map: new THREE.TextureLoader().load("/particles-single.png"),
  });

  // Create an instance of points based on the geometry & material
  points = new THREE.Points(pointsGeometry, pointsMaterial);

  // Rotate the points system (optional)
  // Add them into the scene
  scene.add(points);
}

// Initialize particle system using the sphere
transformMesh();

// Raycaster and mouse vector for detecting mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse movement
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Function to render the scene
function render() {
  requestAnimationFrame(render);

  // Rotate the particle system
  points.rotation.y += 0.001;

  // Update the y-position of the particle system based on scroll
  const scrollY = window.scrollY || window.pageYOffset;
  points.position.y = -3 + scrollY * 0.02; // Adjust the multiplier as needed

  // Update raycaster with the mouse position
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(scene, true);

  if (pointsGeometry.attributes.position) {
    const particlePositions = pointsGeometry.attributes.position.array;

    // Calculate the rotation matrix for the current y-axis rotation
    const rotationMatrix = new THREE.Matrix4().makeRotationY(points.rotation.y);

    if (intersects.length > 0) {
      const intersect = intersects[0].point;

      // Adjust the intersection point by the scroll offset
      intersect.y -= scrollY * 0.02;

      for (let i = 0; i < particleCount; i++) {
        // Apply the rotation matrix to the particle positions
        const position = new THREE.Vector3(
          particlePositions[i * 3],
          particlePositions[i * 3 + 1],
          particlePositions[i * 3 + 2]
        ).applyMatrix4(rotationMatrix);

        // Adjust for the position of the points system
        position.add(points.position);

        const dx = position.x - intersect.x;
        const dy = position.y - intersect.y;
        const dz = position.z - intersect.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < 3) {
          const force = 0.005 / (distance * distance); // Reduced force multiplier
          velocities[i * 3] += dx * force;
          velocities[i * 3 + 1] += dy * force;
          velocities[i * 3 + 2] += dz * force;
        }
      }
    }

    // Update particle positions based on velocities and apply damping
    for (let i = 0; i < particleCount; i++) {
      velocities[i * 3] *= 0.95;
      velocities[i * 3 + 1] *= 0.95;
      velocities[i * 3 + 2] *= 0.95;

      particlePositions[i * 3] += velocities[i * 3];
      particlePositions[i * 3 + 1] += velocities[i * 3 + 1];
      particlePositions[i * 3 + 2] += velocities[i * 3 + 2];

      // Apply a force to return particles to their original positions
      const dx = originalPositions[i * 3] - particlePositions[i * 3];
      const dy = originalPositions[i * 3 + 1] - particlePositions[i * 3 + 1];
      const dz = originalPositions[i * 3 + 2] - particlePositions[i * 3 + 2];

      velocities[i * 3] += dx * 0.005; // Reduced return force
      velocities[i * 3 + 1] += dy * 0.005;
      velocities[i * 3 + 2] += dz * 0.005;
    }

    pointsGeometry.attributes.position.needsUpdate = true;
  }

  controls.update(); // Update OrbitControls
  renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / (window.innerHeight + 300);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, (window.innerHeight + 300));
});

render();