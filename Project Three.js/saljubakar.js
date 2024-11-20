import * as THREE from './module/three.module.js'; // Mengimpor modul Three.js

main(); // Memanggil fungsi utama

function main() {
    // --------------------
    // PART 1: INISIALISASI
    // --------------------

    // Buat konteks
    const canvas = document.querySelector("#c"); // Mengambil elemen canvas
    const gl = new THREE.WebGLRenderer({
        canvas,
        antialias: true // Mengaktifkan antialiasing untuk tampilan lebih halus
    });

    // Buat kamera
    const angleOfView = 55; // Sudut pandang kamera
    const aspectRatio = canvas.clientWidth / canvas.clientHeight; // Rasio aspek
    const nearPlane = 0.1; // Bidang dekat
    const farPlane = 100; // Bidang jauh
    const camera = new THREE.PerspectiveCamera(
        angleOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );
    camera.position.set(0, 5, 25); // Posisi kamera

    // Buat scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0.7, 0.4, 0.6); // Mengubah warna latar belakang
    const fog = new THREE.Fog("pink", 1, 100); // Mengatur kabut
    scene.fog = fog; // Menambahkan kabut ke scene

    // --------------------
    // PART 2: GEOMETRI DAN MATERIAL
    // --------------------

    // GEOMETRY
    const cubeSize = 4; // Ukuran kubus
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const sphereRadius = 3; // Jari-jari bola
    const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 32, 16);
    const planeWidth = 256; // Lebar bidang
    const planeHeight = 256; // Tinggi bidang
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);

    // MATERIALS
    const textureLoader = new THREE.TextureLoader(); // Memuat tekstur

    // Material kubus dengan tekstur
    const cubeTextureMap = textureLoader.load('image/kotak_texture.jpg'); 
    const cubeMaterial = new THREE.MeshStandardMaterial({ map: cubeTextureMap });
    
    // Material bola dengan normal map
    const sphereNormalMap = textureLoader.load('image/texture_kertas.jpeg');
    sphereNormalMap.wrapS = THREE.RepeatWrapping; 
    sphereNormalMap.wrapT = THREE.RepeatWrapping; 
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'coral', normalMap: sphereNormalMap });

    // Material bidang dengan tekstur dan normal map
    const planeTextureMap = textureLoader.load('image/pebble.jpeg'); 
    planeTextureMap.wrapS = THREE.RepeatWrapping; 
    planeTextureMap.wrapT = THREE.RepeatWrapping; 
    planeTextureMap.repeat.set(16, 16); 
    const planeNorm = textureLoader.load('image/normal-map.jpg'); 
    planeNorm.wrapS = THREE.RepeatWrapping; 
    planeNorm.wrapT = THREE.RepeatWrapping; 
    const planeMaterial = new THREE.MeshStandardMaterial({ map: planeTextureMap, side: THREE.DoubleSide, normalMap: planeNorm });

    // MESHES
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial); 
    cube.position.set(2, 10, 0); 
    scene.add(cube); 

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); 
    sphere.position.set(-sphereRadius - 2, 10, 0); 
    scene.add(sphere); 

    const plane = new THREE.Mesh(planeGeometry, planeMaterial); 
    plane.rotation.x = -Math.PI / 2; 
    scene.add(plane); 

    // --------------------
    // PART 3: ANIMASI DAN RENDER
    // --------------------

    // LIGHTS
    const color = 0xffffff; 
    const intensity = 3; 
    const light = new THREE.DirectionalLight(color, intensity); 
    light.position.set(5, 30, 30); 
    scene.add(light); 

    const ambientColor = 0xEC8305; 
    const ambientIntensity = 0.3; 
    const ambientLight = new THREE.AmbientLight(ambientColor, ambientIntensity); 
    scene.add(ambientLight); 

    // --------------------
    // PARTIKEL TERBAKAR
    // --------------------
    const fireParticleCount = 200; // Jumlah partikel api
    const fireParticles = new THREE.BufferGeometry();
    const firePositions = new Float32Array(fireParticleCount * 3); // 3 komponen per partikel (x, y, z)

    for (let i = 0; i < fireParticleCount; i++) {
        // Distribusi partikel di atas kubus
        firePositions[i * 3] = 2 + (Math.random() - 0.5) * 2; // Acak posisi x dalam kisaran kubus
        firePositions[i * 3 + 1] = 10 + Math.random() * 2; // Posisi y di atas kubus
        firePositions[i * 3 + 2] = (Math.random() - 0.5) * 2; // Acak posisi z dalam kisaran kubus
    }

    fireParticles.setAttribute('position', new THREE.BufferAttribute(firePositions, 3));
    const fireParticleMaterial = new THREE.PointsMaterial({
        color: 0xff4500, // Warna partikel (oranye kemerahan)
        size: 1.5, // Ukuran partikel yang lebih besar
        transparent: true,
        opacity: 0.9 // Transparansi
    });

    const fireParticleSystem = new THREE.Points(fireParticles, fireParticleMaterial);
    scene.add(fireParticleSystem); // Menambahkan partikel api ke scene

    // --------------------
    // PARTIKEL SALJU
    // --------------------
    const snowParticleCount = 500; // Jumlah partikel salju
    const snowParticles = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowParticleCount * 3); // 3 komponen per partikel (x, y, z)

    for (let i = 0; i < snowParticleCount; i++) {
        // Posisi salju acak di area scene
        snowPositions[i * 3] = (Math.random() - 0.5) * 50; // Acak posisi x
        snowPositions[i * 3 + 1] = Math.random() * 50 + 20; // Acak posisi y (di atas)
        snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 50; // Acak posisi z
    }

    snowParticles.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));
    const snowParticleMaterial = new THREE.PointsMaterial({
        color: 0xffffff, // Warna partikel salju
        size: 0.5, // Ukuran partikel salju
        transparent: true,
        opacity: 0.8 // Transparansi
    });

    const snowParticleSystem = new THREE.Points(snowParticles, snowParticleMaterial);
    scene.add(snowParticleSystem); // Menambahkan partikel salju ke scene

    // DRAW
    function draw(time) {
        time *= 0.001; // Mengubah waktu menjadi detik

        if (resizeGLToDisplaySize(gl)) { 
            const canvas = gl.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight; 
            camera.updateProjectionMatrix(); 
        }
        
        // Rotasi kubus
        cube.rotation.x += 0.00; 
        cube.rotation.y += 0.02; 

        // Rotasi bola
        sphere.rotation.x += 0.0; 
        sphere.rotation.y += 0.04; 

        // Menggerakkan cahaya
        light.position.x = 10 * Math.cos(time); 
        light.position.y = 10 * Math.sin(time); 

        // Menggerakkan partikel api
        const firePositions = fireParticleSystem.geometry.attributes.position.array;
        for (let i = 1; i < firePositions.length; i += 3) {
            firePositions[i] += 0.1; // Menggerakkan partikel api ke atas
            if (firePositions[i] > 15) { // Reset posisi partikel api
                firePositions[i] = 10 + Math.random() * 2; // Kembali ke atas kubus
                firePositions[i - 1] = 2 + (Math.random() - 0.5) * 2; // Acak posisi x
                firePositions[i + 1] = (Math.random() - 0.5) * 2; // Acak posisi z
            }
        }
        fireParticleSystem.geometry.attributes.position.needsUpdate = true; // Memperbarui posisi partikel api

        // Menggerakkan partikel salju
        const snowPositions = snowParticleSystem.geometry.attributes.position.array;
        for (let i = 1; i < snowPositions.length; i += 3) {
            snowPositions[i] -= 0.1; // Menurunkan partikel salju
            if (snowPositions[i] < 0) { // Reset posisi partikel salju
                snowPositions[i] = Math.random() * 50 + 20; // Kembali ke atas
                snowPositions[i - 1] = (Math.random() - 0.5) * 50; // Acak posisi x
                snowPositions[i + 1] = (Math.random() - 0.5) * 50; // Acak posisi z
            }
        }
        snowParticleSystem.geometry.attributes.position.needsUpdate = true; // Memperbarui posisi partikel salju

        gl.render(scene, camera); 
        requestAnimationFrame(draw); 
    }

    requestAnimationFrame(draw); // Memulai animasi

    // UPDATE RESIZE
    function resizeGLToDisplaySize(gl) {
        const canvas = gl.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height; 
        if (needResize) {
            gl.setSize(width, height, false); 
        }
        return needResize; 
    }
}
