const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0x404040); 
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// lode the thing
const loader = new THREE.GLTFLoader();

let schoolBuilding, studentModel, classroom, tree, teacherModel, schoolyard;
loader.load('models/school_building.glb', function (gltf) {
    schoolBuilding = gltf.scene;
    schoolBuilding.scale.set(1, 1, 1);
    schoolBuilding.position.set(0, 0, 0);
    scene.add(schoolBuilding);
});

loader.load('models/student.glb', function (gltf) {
    studentModel = gltf.scene;
    studentModel.scale.set(0.5, 0.5, 0.5); // Adjust scale
    studentModel.position.set(-5, 0, 0);
    scene.add(studentModel);
});

loader.load('models/classroom.glb', function (gltf) {
    classroom = gltf.scene;
    classroom.scale.set(1, 1, 1);
    classroom.position.set(0, 0, 0);
    scene.add(classroom);
});

const letterText = [
    "Dear Incoming 6th Graders...",
    "1. Don’t be scared.",
    "2. Take charge.",
    "3. Reflect on everything.",
    "4. Learn to advocate for yourself.",
    "Sincerely, [Your Name]"
];

let letterIndex = 0;
let textTimer = 0;
const textDelay = 3; 

let textObjects = [];
let textOpacity = [];

function createText(textContent, position) {
    const loader = new THREE.FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        const geometry = new THREE.TextGeometry(textContent, {
            font: font,
            size: 1,
            height: 0.1,
        });
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        const textMesh = new THREE.Mesh(geometry, material);
        textMesh.position.set(position.x, position.y, position.z);
        scene.add(textMesh);

        textObjects.push(textMesh);
        textOpacity.push(0);
    });
}

function updateTextOpacity() {
    if (letterIndex < textObjects.length) {
        const textMesh = textObjects[letterIndex];
        textOpacity[letterIndex] += 0.05; 
        if (textOpacity[letterIndex] > 1) {
            textOpacity[letterIndex] = 1; 
        }
        textMesh.material.opacity = textOpacity[letterIndex];
    }
}

function updateLetter() {
    if (letterIndex < letterText.length) {
        createText(letterText[letterIndex], { x: 0, y: 2 - letterIndex * 2, z: 0 });
        letterIndex++;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (studentModel) {
        studentModel.position.x += 0.05; 
        if (studentModel.position.x > 5) {
            studentModel.position.x = -5;
        }
    }

    textTimer += 0.016; 
    if (textTimer > textDelay && letterIndex < letterText.length) {
        updateLetter();
        textTimer = 0;
    }

    updateTextOpacity();

    renderer.render(scene, camera);
}

camera.position.z = 5;

animate();

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
