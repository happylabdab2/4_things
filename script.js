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
const objloader = new THREE.OBJLoader();

let schoolBuilding_All, studentModel, teachtalk , teacherModel;

let loaded = [0,0,0,0];
let done_each = [false,false,false,false];

while (done_each[0] == false || done_each[1] == false || done_each[2] == false || done_each[3] == false) {
    document.getElementById('loadingBar').style.width = (loaded[0] + loaded[1] + loaded[2] + loaded[3]) / 4 + '%';
}

objloader.load('models/schoolBuilding_All.obj', function (obj) {
    schoolBuilding = obj.scene;
    schoolBuilding.scale.set(1, 1, 1);
    schoolBuilding.position.set(0, 0, 0);
    scene.add(schoolBuilding);
}, function (xhr) {
    loaded[0] = xhr.loaded / xhr.total * 100;
    document.getElementById('rn_fileprs').innerText = (xhr.loaded / xhr.total * 100) + '% loaded';
    document.getElementById('currentfile').innerText = "schoolBuilding_All.obj ";
    if (loaded[0] == 100 && !done_each[0]) {
        done_each[0] = true;
        document.getElementById('rn_fileprs').innerText = "100% loaded";
    }

}, function (error) {
    alert('An error happened: ' + error);
}
)

loader.load('models/student_interact.glb', function (gltf) {
    studentModel = gltf.scene;
    studentModel.scale.set(0.5, 0.5, 0.5); // Adjust scale
    studentModel.position.set(-5, 0, 0);
    scene.add(studentModel);
}, function (xhr) {
    
    document.getElementById('rn_fileprs').innerText = (xhr.loaded / xhr.total * 100) + '% loaded';
    document.getElementById('currentfile').innerText = "student_interact.glb ";

}, function (error) {
    alert('An error happened: ' + error);
}

);

loader.load('models/student_teachtalk.glb', function (gltf) {
    teachtalk = gltf.scene;
    teachtalk.scale.set(0.5, 0.5, 0.5); // Adjust scale
    teachtalk.position.set(-5, 0, 0);
    scene.add(teachtalk);
}, function (xhr) {
    
    document.getElementById('rn_fileprs').innerText = (xhr.loaded / xhr.total * 100) + '% loaded';
    document.getElementById('currentfile').innerText = "student_teachtalk.glb ";

}, function (error) {
    alert('An error happened: ' + error);
}
);

loader.load('models/teacher.glb', function (gltf) {
    teacherModel = gltf.scene;
    teacherModel.scale.set(0.5, 0.5, 0.5); // Adjust scale
    teacherModel.position.set(-5, 0, 0);
    scene.add(teacherModel);
}, function (xhr) {
    
    document.getElementById('rn_fileprs').innerText = (xhr.loaded / xhr.total * 100) + '% loaded';
    document.getElementById('currentfile').innerText = "teacher.glb ";

}, function (error) {
    alert('An error happened: ' + error);
}
);

const letterText = [
    "Dear Incoming 6th Graders...",
    "1. Don't be scared.",
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
