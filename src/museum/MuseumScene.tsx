import { Float, OrbitControls, Stars, Text } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import type { MuseumRoom } from '@/types/museum';

type MuseumSceneProps = {
  rooms: MuseumRoom[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
};

function RoomPortal({ room, active, position, onSelect }: { room: MuseumRoom; active: boolean; position: [number, number, number]; onSelect: (roomId: string) => void }) {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} onClick={() => onSelect(room.id)}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 3.4, 0.5]} />
          <meshStandardMaterial color={room.color} emissive={room.color} emissiveIntensity={active ? 1.2 : 0.45} roughness={0.28} metalness={0.4} />
        </mesh>
        <Text position={[0, -2.5, 0]} color="#ffffff" fontSize={0.34} anchorX="center" anchorY="middle">
          {room.name}
        </Text>
      </group>
    </Float>
  );
}

export function MuseumScene({ rooms, activeRoomId, onSelectRoom }: MuseumSceneProps) {
  return (
    <div className="h-[540px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_30%),linear-gradient(180deg,#171717,#0b0b0b)]">
      <Canvas camera={{ position: [0, 5, 12], fov: 42 }} shadows>
        <ambientLight intensity={0.75} />
        <pointLight position={[0, 6, 0]} intensity={55} color="#f3d98d" />
        <pointLight position={[8, 4, 4]} intensity={22} color="#8b5cf6" />
        <Stars radius={60} depth={50} count={2000} factor={4} saturation={0} fade speed={0.9} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[10, 64]} />
          <meshStandardMaterial color="#111111" roughness={0.86} metalness={0.2} />
        </mesh>
        {rooms.slice(0, 5).map((room, index) => {
          const angle = (index / 5) * Math.PI * 2;
          return (
            <RoomPortal
              key={room.id}
              room={room}
              active={room.id === activeRoomId}
              position={[Math.cos(angle) * 5.2, 2.1, Math.sin(angle) * 5.2]}
              onSelect={onSelectRoom}
            />
          );
        })}
        <Text position={[0, 5.8, 0]} color="#D4AF37" fontSize={0.52} anchorX="center" anchorY="middle">
          Virtual Museum Lobby
        </Text>
        <OrbitControls enablePan={false} maxDistance={16} minDistance={8} maxPolarAngle={Math.PI / 2.15} minPolarAngle={Math.PI / 3.2} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  );
}