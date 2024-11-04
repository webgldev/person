// scripts/threejs.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 개발 모드 플래그 설정
const isDevelopment = false; // 배포 시 false로 변경하세요.

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

// 씬, 카메라, 렌더러 설정
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 10, 10);
camera.lookAt(new THREE.Vector3(0, 10, 0));

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('main').appendChild(renderer.domElement); // #main에 추가

// 조명 추가
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// 각 섹션에 대한 설정 정의
const sections = [
  // 섹션 1
  {
    position: new THREE.Vector3(-2, 10, 0),
    rotation: new THREE.Euler(0, 1, 0),
    scale: new THREE.Vector3(2, 2, 2)
  },
  // 섹션 2
  {
    position: new THREE.Vector3(0, 10, 5),
    rotation: new THREE.Euler(0, Math.PI / 2, 0),
    scale: new THREE.Vector3(2.5, 2.5, 2.5)
  },
  // 섹션 3
  {
    position: new THREE.Vector3(1, 10, 2),
    rotation: new THREE.Euler(0.5, 1, 0.1), 
    scale: new THREE.Vector3(2, 2, 2)
  },
  // 섹션 4
  {
    position: new THREE.Vector3(-3, 12, 1),
    rotation: new THREE.Euler(0, Math.PI / 3, -0.5),
    scale: new THREE.Vector3(3, 3, 3)
  },
  // 섹션 5
  {
    position: new THREE.Vector3(-2, 10, 0),
    rotation: new THREE.Euler(0, 1, 0),
    scale: new THREE.Vector3(2, 2, 2)
  }
];

// 경로의 제어점 정의 (Y축을 주축으로 설정)
const curvePoints = sections.map(section => section.position);
const rotationValues = sections.map(section => section.rotation);
const scaleValues = sections.map(section => section.scale);

// GLTFLoader를 사용해 GLB 모델 불러오기
let model;
let boundingBox; // 박스를 전역 변수로 선언
const loader = new GLTFLoader();
loader.load(
  'aesop_cosmetic.glb',
  (gltf) => {
    model = gltf.scene;
    model.position.copy(curvePoints[0]); // 모델을 첫 번째 점 위치에 설정
    model.rotation.copy(rotationValues[0]); // 초기 회전 설정
    model.scale.copy(scaleValues[0]); // 모델 크기 조정
    scene.add(model);
    console.log('모델이 성공적으로 로드되었습니다.');

    // 모델의 경계 상자 계산
    const box = new THREE.Box3().setFromObject(model);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);

    // 박스 생성 및 추가 (개발 모드일 때만)
    if (isDevelopment) {
      const boxGeometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z); // 박스 크기 설정
      const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }); // 박스 재질 설정
      boundingBox = new THREE.Mesh(boxGeometry, boxMaterial);
      
      // 박스 위치를 모델의 중앙으로 설정
      boundingBox.position.copy(box.getCenter(new THREE.Vector3()));
      scene.add(boundingBox); // 씬에 박스 추가

      console.log('개발 모드: boundingBox가 추가되었습니다.');
    }

    // 첫 번째 라벨을 보이게 설정
    gsap.to('#label01', {
      opacity: 1,
      duration: 1,
      ease: 'power1.out'
    });

    // ScrollTrigger 설정
    setupScrollTriggers();
  },
  undefined,
  (error) => {
    console.error('GLB 모델을 불러오는 중 오류 발생:', error);
  }
);

// ScrollTrigger 설정 함수
function setupScrollTriggers() {
  console.log('ScrollTriggers 설정 시작');

  // 각 섹션마다 ScrollTrigger 생성
  curvePoints.forEach((point, index) => {
    if (index === 0) return; // 첫 번째 점은 초기 위치이므로 건너뜁니다.

    // 해당 섹션의 라벨 ID 설정
    const labelId = `#label0${index + 1}`;

    ScrollTrigger.create({
      trigger: `#section0${index + 1}`, // 예: #section02, #section03, ...
      scroller: '#main',               // 스크롤 컨테이너 지정
      start: 'top center',             // 섹션이 중앙에 도달할 때 애니메이션 시작
      end: 'bottom center',            // 섹션이 중앙을 떠날 때 애니메이션 끝
      onEnter: () => {
        gsap.to(model.position, {
          x: point.x,
          y: point.y,
          z: point.z,
          duration: 1,
          ease: 'power1.inOut'
        });
        // 모델 회전 설정
        gsap.to(model.rotation, {
          x: rotationValues[index].x,
          y: rotationValues[index].y,
          z: rotationValues[index].z,
          duration: 1,
          ease: 'power1.inOut'
        });
        // 모델 스케일 설정
        gsap.to(model.scale, {
          x: scaleValues[index].x,
          y: scaleValues[index].y,
          z: scaleValues[index].z,
          duration: 1,
          ease: 'power1.inOut'
        });
        
        // 라벨 페이드 인 애니메이션
        gsap.to(labelId, {
          opacity: 1,
          duration: 1,
          ease: 'power1.out'
        });
      },
      onLeaveBack: () => {
        // 이전 섹션으로 돌아갈 때 이전 위치와 회전으로 이동
        let targetPoint;
        let targetRotation;
        let targetScale;
        if (index > 1) {
          targetPoint = curvePoints[index - 1];
          targetRotation = rotationValues[index - 1];
          targetScale = scaleValues[index - 1];
        } else {
          targetPoint = curvePoints[0];
          targetRotation = rotationValues[0];
          targetScale = scaleValues[0];
        }

        gsap.to(model.position, {
          x: targetPoint.x,
          y: targetPoint.y,
          z: targetPoint.z,
          duration: 1,
          ease: 'power1.inOut'
        });

        gsap.to(model.rotation, {
          x: targetRotation.x,
          y: targetRotation.y,
          z: targetRotation.z,
          duration: 1,
          ease: 'power1.inOut'
        });

        gsap.to(model.scale, {
          x: targetScale.x,
          y: targetScale.y,
          z: targetScale.z,
          duration: 1,
          ease: 'power1.inOut'
        });

        // 라벨 페이드 아웃 애니메이션
        gsap.to(labelId, {
          opacity: 0,
          duration: 1,
          ease: 'power1.out'
        });
      },
      markers: isDevelopment // 개발 모드일 때만 마커 표시
    });
  });

  console.log('ScrollTriggers 설정 완료');
}

// 윈도우 리사이즈 이벤트 리스너 추가
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 애니메이션 루프 정의
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  // 모델의 경계 상자 업데이트
  if (model && isDevelopment && boundingBox) {
    const box = new THREE.Box3().setFromObject(model);
    boundingBox.position.copy(box.getCenter(new THREE.Vector3())); // 박스 위치 업데이트
  }
}
animate();

// =======================================================
// 개발 모드 전용 디버깅 요소 추가 (커브, 점)
// =======================================================
if (isDevelopment) {
  // CatmullRomCurve3을 사용하여 경로 생성 (경로 시각화를 위한 옵션)
  const curve = new THREE.CatmullRomCurve3(curvePoints);

  // 커브를 시각화하기 위한 Line 생성
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const curveObject = new THREE.Line(geometry, material);
  scene.add(curveObject); // 커브 객체를 씬에 추가

  // 점 추가 함수 및 호출
  function addPointsAtSectionLocations() {
    const pointMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.5 });
    curvePoints.forEach((point) => {
      const pointGeometry = new THREE.BufferGeometry().setFromPoints([point]);
      const pointObject = new THREE.Points(pointGeometry, pointMaterial);
      scene.add(pointObject); // 씬에 점 추가
    });
  }
  addPointsAtSectionLocations();

  console.log('개발 모드: 커브와 점이 추가되었습니다.');
}
