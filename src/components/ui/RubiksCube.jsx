import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CUBE_SIZE = 1.05;
const CUBIES = [];
for (let x of [-1, 0, 1]) {
  for (let y of [-1, 0, 1]) {
    for (let z of [-1, 0, 1]) {
      CUBIES.push({ id: `${x}${y}${z}`, initX: x, initY: y, initZ: z });
    }
  }
}

const COLORS = {
  background: '#fff8e7',
  text: '#111111',
  yellow: '#ffd23f',
  pink: '#ff5d8f',
  blue: '#00b7ff',
  green: '#7ae582',
  red: '#ff595e',
};

const createTextTexture = (text, bgColor) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 512, 512);
  
  ctx.fillStyle = COLORS.text;
  ctx.font = 'bold 420px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 275);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const SCRAMBLE_MOVES = [
  { axis: 'y', slice: 1, dir: 1 },
  { axis: 'x', slice: 0, dir: -1 },
  { axis: 'z', slice: -1, dir: 1 },
  { axis: 'y', slice: 0, dir: -1 },
  { axis: 'x', slice: -1, dir: 1 },
  { axis: 'z', slice: 1, dir: 1 },
  { axis: 'y', slice: -1, dir: 1 },
  { axis: 'x', slice: 1, dir: -1 },
];

const SOLVE_MOVES = [...SCRAMBLE_MOVES].map(m => ({ ...m, dir: -m.dir })).reverse();

export const RubiksCube = () => {
  const groupRef = useRef();
  
  const stateRef = useRef({
    cubies: CUBIES.map(c => ({
      ...c,
      pos: new THREE.Vector3(c.initX, c.initY, c.initZ),
      rot: new THREE.Quaternion(),
      basePos: new THREE.Vector3(c.initX, c.initY, c.initZ),
      baseRot: new THREE.Quaternion(),
    })),
    phase: 'SCRAMBLING',
    moveIndex: 0,
    progress: 0,
    pauseTimer: 0
  });

  const getMaterials = useMemo(() => {
    const texCBlue = createTextTexture('C', COLORS.blue);
    const texOGreen = createTextTexture('O', COLORS.green);
    const texCPink = createTextTexture('C', COLORS.pink);
    const texSYellow = createTextTexture('S', COLORS.yellow);

    return (x, y, z) => {
      const baseProps = {
        metalness: 0.15,
        roughness: 0.75,
      };

      const mats = [
        // Right (+X)
        new THREE.MeshPhysicalMaterial({
          ...baseProps,
          color: COLORS.pink,
        }),

        // Left (-X)
        new THREE.MeshPhysicalMaterial({
          ...baseProps,
          color: COLORS.yellow,
        }),

        // Top (+Y)
        new THREE.MeshPhysicalMaterial({
          ...baseProps,
          color: COLORS.red,
        }),

        // Bottom (-Y)
        new THREE.MeshPhysicalMaterial({
          ...baseProps,
          color: COLORS.background,
        }),

        // Front (+Z)
        new THREE.MeshPhysicalMaterial({
          ...baseProps,
          color: COLORS.blue,
        }),

        // Back (-Z)
        new THREE.MeshPhysicalMaterial({
          ...baseProps,
          color: COLORS.green,
        }),
      ];

      const applyLetter = (faceIndex, tex, offsetU, offsetV) => {
        const t = tex.clone();

        t.repeat.set(1 / 3, 1 / 3);
        t.offset.set(offsetU, offsetV);

        mats[faceIndex] = new THREE.MeshPhysicalMaterial({
          ...baseProps,
          map: t,
        });
      };

      // Front face (Blue C)
      if (z === 1) {
        applyLetter(
          4,
          texCBlue,
          (x + 1) / 3,
          (y + 1) / 3
        );
      }

      // Back face (Green O)
      if (z === -1) {
        applyLetter(
          5,
          texOGreen,
          (-x + 1) / 3,
          (y + 1) / 3
        );
      }

      // Right face (Pink C)
      if (x === 1) {
        applyLetter(
          0,
          texCPink,
          (-z + 1) / 3,
          (y + 1) / 3
        );
      }

      // Left face (Yellow S)
      if (x === -1) {
        applyLetter(
          1,
          texSYellow,
          (z + 1) / 3,
          (y + 1) / 3
        );
      }

      return mats;
    };
  }, []);

  useFrame((state, delta) => {
    const s = stateRef.current;
    
    if (groupRef.current) {
       groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + 0.2;
       groupRef.current.rotation.y = -(state.clock.elapsedTime * 0.2) + 0.5;
    }

    if (s.phase === 'PAUSED_SCRAMBLED' || s.phase === 'PAUSED_SOLVED') {
      s.pauseTimer -= delta;
      if (s.pauseTimer <= 0) {
        if (s.phase === 'PAUSED_SCRAMBLED') {
          s.phase = 'SOLVING';
          s.moveIndex = 0;
        } else {
          s.phase = 'SCRAMBLING';
          s.moveIndex = 0;
        }
      }
      return;
    }

    const moves = s.phase === 'SCRAMBLING' ? SCRAMBLE_MOVES : SOLVE_MOVES;
    if (s.moveIndex >= moves.length) {
      s.phase = s.phase === 'SCRAMBLING' ? 'PAUSED_SCRAMBLED' : 'PAUSED_SOLVED';
      s.pauseTimer = s.phase === 'PAUSED_SOLVED' ? 4.0 : 0.5;
      return;
    }

    const currentMove = moves[s.moveIndex];
    const SPEED = 3.5;
    s.progress += delta * SPEED;

    let moveFinished = false;
    if (s.progress >= 1) {
      s.progress = 1;
      moveFinished = true;
    }

    const angle = currentMove.dir * (Math.PI / 2) * s.progress;
    const axisVec = new THREE.Vector3(
      currentMove.axis === 'x' ? 1 : 0,
      currentMove.axis === 'y' ? 1 : 0,
      currentMove.axis === 'z' ? 1 : 0
    );
    const rotQuat = new THREE.Quaternion().setFromAxisAngle(axisVec, angle);

    s.cubies.forEach(cubie => {
      const axisVal = Math.round(cubie.basePos[currentMove.axis]);
      if (axisVal === currentMove.slice) {
        const newPos = cubie.basePos.clone().applyQuaternion(rotQuat);
        cubie.pos.copy(newPos);
        cubie.rot.copy(rotQuat.clone().multiply(cubie.baseRot));
      }
    });

    if (moveFinished) {
      s.cubies.forEach(cubie => {
        cubie.basePos.copy(cubie.pos);
        cubie.basePos.x = Math.round(cubie.basePos.x);
        cubie.basePos.y = Math.round(cubie.basePos.y);
        cubie.basePos.z = Math.round(cubie.basePos.z);
        cubie.baseRot.copy(cubie.rot);
      });
      s.progress = 0;
      s.moveIndex++;
    }
  });

  return (
    <group ref={groupRef} scale={0.75}>
      {stateRef.current.cubies.map((cubie) => (
        <CubieMesh 
          key={cubie.id} 
          cubie={cubie} 
          materials={getMaterials(cubie.initX, cubie.initY, cubie.initZ)} 
        />
      ))}
    </group>
  );
};

const CubieMesh = ({ cubie, materials }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      // Multiply by slightly more than CUBE_SIZE to create beautiful visible seams
      meshRef.current.position.copy(cubie.pos).multiplyScalar(CUBE_SIZE * 1.02);
      meshRef.current.quaternion.copy(cubie.rot);
    }
  });

  return (
    <mesh ref={meshRef} material={materials}>
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
    </mesh>
  );
};

export default RubiksCube;