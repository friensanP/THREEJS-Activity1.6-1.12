import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as dat from 'lil-gui';

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl');

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Object: Christmas Tree
 */
// Tree trunk
const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
trunk.position.y = 0.5;
scene.add(trunk);

// Tree foliage
let foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x008000 });

const foliage1 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.5, 32), foliageMaterial);
foliage1.position.y = 1.5;
scene.add(foliage1);

const foliage2 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.2, 32), foliageMaterial);
foliage2.position.y = 2.3;
scene.add(foliage2);

const foliage3 = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1, 32), foliageMaterial);
foliage3.position.y = 3;
scene.add(foliage3);

// Star on top
const starGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 });
const star = new THREE.Mesh(starGeometry, starMaterial);
star.position.y = 3.7;
scene.add(star);

/**
 * Add Text
 */
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Merry Christmas!', {
        font: font,
        size: 0.8,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelSegments: 5
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textGeometry.center(); // Center the text
    textMesh.position.y = -1; // Place the text below the tree
    scene.add(textMesh);

    // Add GUI control to change text color
    gui.addColor({ textColor: 0xFFFFFF }, 'textColor').onChange(color => {
        textMesh.material.color.set(color);
    });
});

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2.5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Add GUI control to change foliage color
 */
gui.addColor({ foliageColor: 0x008000 }, 'foliageColor').onChange(color => {
    foliageMaterial.color.set(color);
});

/**
 * Snowflakes (Floating Snow)
 */
// Create an array to hold the snowflakes
const snowflakes = [];
const snowflakeCount = 100;

// Create snowflakes
for (let i = 0; i < snowflakeCount; i++) {
    const snowflakeGeometry = new THREE.SphereGeometry(0.05, 8, 8); // Small snowflakes
    const snowflakeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);

    // Random position for each snowflake
    snowflake.position.set(
        Math.random() * 10 - 5, // Random X
        Math.random() * 10 + 5, // Random Y (start from above the tree)
        Math.random() * 10 - 5  // Random Z
    );

    // Random falling speed
    snowflake.velocity = Math.random() * 0.05 + 0.01;

    snowflakes.push(snowflake);
    scene.add(snowflake);
}

/**
 * Animate Snowflakes
 */
function animateSnowflakes() {
    snowflakes.forEach(snowflake => {
        snowflake.position.y -= snowflake.velocity; // Move snowflake down

        // Reset snowflake position if it goes below the scene
        if (snowflake.position.y < -5) {
            snowflake.position.y = Math.random() * 10 + 5;
        }
    });
}

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Rotate the tree
    const speed = 0.5; // Adjust rotation speed if needed
    trunk.rotation.y = elapsedTime * speed;
    foliage1.rotation.y = elapsedTime * speed;
    foliage2.rotation.y = elapsedTime * speed;
    foliage3.rotation.y = elapsedTime * speed;
    star.rotation.y = elapsedTime * speed;

    // Animate snowflakes
    animateSnowflakes();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
