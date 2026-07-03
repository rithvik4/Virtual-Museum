import { PointerLockControls, Stars, Text } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CanvasTexture, Group, SRGBColorSpace, Texture, TextureLoader, Vector3 } from 'three';

import { GlassCard } from '@/cards/GlassCard';
import type { Artwork, MuseumRoom } from '@/types/museum';

type ImmersiveRoomExperienceProps = {
  room: MuseumRoom;
  artworks: Artwork[];
  rooms: MuseumRoom[];
  onSwitchRoom: (roomId: string) => void;
  onExit: () => void;
};

type FrameFocusTarget = {
  position: [number, number, number];
  lookAt: [number, number, number];
};

function seededFrameColor(seed: string): string {
  const hash = seed.split('').reduce((acc, char, index) => {
    return (acc + char.charCodeAt(0) * (index + 1) * 17) % 360;
  }, 0);
  return `hsl(${hash}, 58%, 42%)`;
}

function buildEmbeddedFallbackTexture(seed: string, tint: string): Texture | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const width = 356;
  const height = 464;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  const hash = seed.split('').reduce((acc, char, index) => {
    return (acc + char.charCodeAt(0) * (index + 1) * 17) % 360;
  }, 0);
  const primary = `hsl(${hash}, 58%, 42%)`;
  const secondary = `hsl(${(hash + 48) % 360}, 46%, 12%)`;
  const accent = tint || primary;
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, primary);
  gradient.addColorStop(1, secondary);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.globalAlpha = 0.18;
  context.fillStyle = accent;
  context.fillRect(20, 20, width - 40, height - 40);

  context.globalAlpha = 0.14;
  for (let i = 0; i < 70; i += 1) {
    const x = ((seed.charCodeAt(i % seed.length) || i * 17) * 19) % width;
    const y = ((seed.charCodeAt((i + 3) % seed.length) || i * 23) * 13) % height;
    const size = 8 + (i % 16);
    context.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#F8D98A';
    context.fillRect(x, y, size, size);
  }

  context.globalAlpha = 0.88;
  context.fillStyle = '#FFFFFF';
  context.font = '700 24px Georgia';
  context.textAlign = 'center';
  context.fillText('Virtual Museum', width / 2, height / 2 - 8);

  context.globalAlpha = 0.72;
  context.font = '500 14px Arial';
  context.fillText(seed.slice(0, 18), width / 2, height / 2 + 24);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function useFootstepAudio(isWalking: boolean) {
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    if (!contextRef.current) {
      contextRef.current = new AudioContextCtor();
    }

    return contextRef.current;
  }, []);

  const playFootstep = useCallback(async () => {
    const context = getContext();
    if (!context) {
      return;
    }

    await context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const filter = context.createBiquadFilter();
    const now = context.currentTime;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(110 + Math.random() * 30, now);
    oscillator.frequency.exponentialRampToValueAtTime(70, now + 0.11);

    filter.type = 'lowpass';
    filter.frequency.value = 900;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.03, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.16);
  }, [getContext]);

  useEffect(() => {
    if (!isWalking) {
      return;
    }

    void playFootstep();
    const interval = window.setInterval(() => {
      void playFootstep();
    }, 420);

    return () => {
      window.clearInterval(interval);
    };
  }, [isWalking, playFootstep]);
}

function CameraFocusController({ focusTarget }: { focusTarget: FrameFocusTarget | null }) {
  const { camera } = useThree();
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());

  useFrame(() => {
    if (!focusTarget) {
      return;
    }

    targetPosition.current.set(...focusTarget.position);
    targetLookAt.current.set(...focusTarget.lookAt);
    camera.position.lerp(targetPosition.current, 0.12);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}

function FirstPersonMovement({ disabled, onMovingChange }: { disabled: boolean; onMovingChange: (moving: boolean) => void }) {
  const { camera } = useThree();
  const [locked, setLocked] = useState(false);
  const pressedRef = useRef<Record<string, boolean>>({});
  const movingRef = useRef(false);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      pressedRef.current[event.key.toLowerCase()] = true;
    };
    const up = (event: KeyboardEvent) => {
      pressedRef.current[event.key.toLowerCase()] = false;
    };

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);

    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((_, delta) => {
    if (!locked || disabled) {
      if (movingRef.current) {
        movingRef.current = false;
        onMovingChange(false);
      }
      return;
    }

    const speed = 3.2;
    const direction = new Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();

    const right = new Vector3(direction.z, 0, -direction.x).normalize();
    const move = new Vector3();
    const keys = pressedRef.current;

    if (keys.w || keys.arrowup) {
      move.add(direction);
    }
    if (keys.s || keys.arrowdown) {
      move.sub(direction);
    }
    if (keys.a || keys.arrowleft) {
      move.sub(right);
    }
    if (keys.d || keys.arrowright) {
      move.add(right);
    }

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      camera.position.add(move);

      if (!movingRef.current) {
        movingRef.current = true;
        onMovingChange(true);
      }
    } else if (movingRef.current) {
      movingRef.current = false;
      onMovingChange(false);
    }

    camera.position.x = Math.max(-6.5, Math.min(6.5, camera.position.x));
    camera.position.z = Math.max(-6.5, Math.min(6.5, camera.position.z));
    camera.position.y = 1.7;
  });

  return (
    <PointerLockControls
      onLock={() => setLocked(true)}
      onUnlock={() => {
        setLocked(false);
        onMovingChange(false);
      }}
    />
  );
}

function AvatarArms({ walking }: { walking: boolean }) {
  const groupRef = useRef<Group | null>(null);
  const { camera } = useThree();
  const forwardRef = useRef(new Vector3());
  const rightRef = useRef(new Vector3());

  useFrame((state) => {
    if (!groupRef.current) {
      return;
    }

    forwardRef.current.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    rightRef.current.set(1, 0, 0).applyQuaternion(camera.quaternion).normalize();
    const bob = walking ? Math.sin(state.clock.elapsedTime * 12) * 0.018 : 0;

    groupRef.current.position.copy(camera.position)
      .add(forwardRef.current.multiplyScalar(0.35))
      .add(rightRef.current.multiplyScalar(0.03));
    groupRef.current.position.y -= 0.28 - bob;
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-0.14, -0.07, -0.03]}>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <meshStandardMaterial color="#2B3245" roughness={0.62} metalness={0.2} />
      </mesh>
      <mesh position={[0.14, -0.07, -0.03]}>
        <boxGeometry args={[0.16, 0.42, 0.16]} />
        <meshStandardMaterial color="#2B3245" roughness={0.62} metalness={0.2} />
      </mesh>
      <mesh position={[-0.14, -0.27, 0.02]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial color="#C49A7A" roughness={0.75} metalness={0.04} />
      </mesh>
      <mesh position={[0.14, -0.27, 0.02]}>
        <sphereGeometry args={[0.08, 14, 14]} />
        <meshStandardMaterial color="#C49A7A" roughness={0.75} metalness={0.04} />
      </mesh>
    </group>
  );
}

function ArtworkFrame({
  artwork,
  position,
  rotation,
  selected,
  onSelect,
}: {
  artwork: Artwork;
  position: [number, number, number];
  rotation: [number, number, number];
  selected: boolean;
  onSelect: () => void;
}) {
  const primaryImageUrl = (artwork.imageUrl ?? '').trim();
  const secondaryImageUrl = (artwork.thumbnailUrl ?? '').trim();
  const resolvedPrimaryImageUrl = primaryImageUrl ? encodeURI(primaryImageUrl) : '';
  const resolvedSecondaryImageUrl = secondaryImageUrl ? encodeURI(secondaryImageUrl) : '';
  const frameFallbackColor = useMemo(() => seededFrameColor(artwork.id), [artwork.id]);

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <mesh>
        <boxGeometry args={[2.1, 2.7, 0.09]} />
        <meshStandardMaterial color="#2A1C0F" metalness={0.28} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <planeGeometry args={[1.78, 2.32]} />
        <ArtworkTextureMaterial
          imageUrl={resolvedPrimaryImageUrl}
          secondaryImageUrl={resolvedSecondaryImageUrl}
          fallback={frameFallbackColor}
          fallbackSeed={artwork.id}
        />
      </mesh>
      <mesh position={[0, 0, 0.105]}>
        <planeGeometry args={[1.82, 2.36]} />
        <meshStandardMaterial
          color={selected ? '#D4AF37' : '#ffffff'}
          transparent
          opacity={selected ? 0.2 : 0}
          emissive={selected ? '#D4AF37' : '#000000'}
          emissiveIntensity={selected ? 0.6 : 0}
        />
      </mesh>
      <Text position={[0, -1.55, 0.08]} color="#EAEAEA" fontSize={0.13} anchorX="center" anchorY="middle" maxWidth={1.8}>
        {artwork.title}
      </Text>
    </group>
  );
}

function ArtworkTextureMaterial({
  imageUrl,
  secondaryImageUrl,
  fallback,
  fallbackSeed,
}: {
  imageUrl: string;
  secondaryImageUrl: string;
  fallback: string;
  fallbackSeed: string;
}) {
  const generatedFallbackTexture = useMemo(() => buildEmbeddedFallbackTexture(fallbackSeed, fallback), [fallbackSeed, fallback]);
  const fallbackUrl = useMemo(() => `https://picsum.photos/seed/${encodeURIComponent(fallbackSeed)}/356/464`, [fallbackSeed]);

  const attemptUrls = useMemo(() => {
    const urls: string[] = [];
    if (imageUrl) {
      urls.push(imageUrl);
    }
    if (secondaryImageUrl && secondaryImageUrl !== imageUrl) {
      urls.push(secondaryImageUrl);
    }
    urls.push(fallbackUrl);
    return urls;
  }, [imageUrl, secondaryImageUrl, fallbackUrl]);

  const [texture, setTexture] = useState<Texture | null>(generatedFallbackTexture);
  const [attemptIndex, setAttemptIndex] = useState(0);
  const textureRef = useRef<Texture | null>(generatedFallbackTexture);

  useEffect(() => {
    setAttemptIndex(0);
    setTexture((previousTexture) => {
      if (previousTexture && previousTexture !== generatedFallbackTexture) {
        previousTexture.dispose();
      }
      textureRef.current = generatedFallbackTexture;
      return generatedFallbackTexture;
    });
  }, [attemptUrls, generatedFallbackTexture]);

  useEffect(() => {
    return () => {
      textureRef.current?.dispose();
      textureRef.current = null;
    };
  }, []);

  useEffect(() => {
    const attemptUrl = attemptUrls[attemptIndex] ?? '';
    if (!attemptUrl) {
      setTexture(null);
      return;
    }

    let disposed = false;
    const loader = new TextureLoader();
    loader.crossOrigin = 'anonymous';

    loader.load(
      attemptUrl,
      (loadedTexture) => {
        if (disposed) {
          loadedTexture.dispose();
          return;
        }

        loadedTexture.colorSpace = SRGBColorSpace;
        loadedTexture.needsUpdate = true;

        setTexture((previousTexture) => {
          previousTexture?.dispose();
          textureRef.current = loadedTexture;
          return loadedTexture;
        });
      },
      undefined,
      () => {
        if (disposed) {
          return;
        }

        if (attemptIndex < attemptUrls.length - 1) {
          setAttemptIndex((currentIndex) => currentIndex + 1);
          return;
        }
      },
    );

    return () => {
      disposed = true;
    };
  }, [attemptIndex, attemptUrls]);

  return (
    texture ? (
      <meshBasicMaterial map={texture} toneMapped={false} />
    ) : (
      <meshStandardMaterial
        color={fallback}
        roughness={0.52}
        metalness={0.06}
        emissive={fallback}
        emissiveIntensity={0.12}
      />
    )
  );
}

function RoomScene({
  room,
  artworks,
  selectedArtworkId,
  onSelectArtwork,
  focusTarget,
  onMovingChange,
  walking,
}: {
  room: MuseumRoom;
  artworks: Artwork[];
  selectedArtworkId: string | null;
  onSelectArtwork: (artwork: Artwork, target: FrameFocusTarget) => void;
  focusTarget: FrameFocusTarget | null;
  onMovingChange: (moving: boolean) => void;
  walking: boolean;
}) {
  const wallArtworks = artworks.slice(0, 16);

  const frames = useMemo(() => {
    return wallArtworks.map((artwork, index) => {
      const side = index % 4;
      const slot = Math.floor(index / 4);
      const along = -4.5 + slot * 3;

      if (side === 0) {
        return {
          artwork,
          position: [along, 2.2, -7.35] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          focus: {
            position: [along, 1.7, -5.7] as [number, number, number],
            lookAt: [along, 2.1, -7.34] as [number, number, number],
          },
        };
      }

      if (side === 1) {
        return {
          artwork,
          position: [7.35, 2.2, along] as [number, number, number],
          rotation: [0, -Math.PI / 2, 0] as [number, number, number],
          focus: {
            position: [5.7, 1.7, along] as [number, number, number],
            lookAt: [7.34, 2.1, along] as [number, number, number],
          },
        };
      }

      if (side === 2) {
        return {
          artwork,
          position: [along, 2.2, 7.35] as [number, number, number],
          rotation: [0, Math.PI, 0] as [number, number, number],
          focus: {
            position: [along, 1.7, 5.7] as [number, number, number],
            lookAt: [along, 2.1, 7.34] as [number, number, number],
          },
        };
      }

      return {
        artwork,
        position: [-7.35, 2.2, along] as [number, number, number],
        rotation: [0, Math.PI / 2, 0] as [number, number, number],
        focus: {
          position: [-5.7, 1.7, along] as [number, number, number],
          lookAt: [-7.34, 2.1, along] as [number, number, number],
        },
      };
    });
  }, [wallArtworks]);

  return (
    <>
      <ambientLight intensity={0.56} />
      <pointLight position={[0, 5.2, 0]} intensity={48} color={room.color} />
      <pointLight position={[0, 4, -6]} intensity={26} color="#f8d98a" />
      <pointLight position={[0, 4, 6]} intensity={26} color="#f8d98a" />
      <Stars radius={80} depth={55} count={2200} factor={4} saturation={0} fade speed={0.45} />

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0D0D0D" roughness={0.9} metalness={0.2} />
      </mesh>

      <mesh position={[0, 3, -8]}>
        <boxGeometry args={[16, 6, 0.2]} />
        <meshStandardMaterial color="#181A22" roughness={0.85} metalness={0.12} />
      </mesh>
      <mesh position={[0, 3, 8]}>
        <boxGeometry args={[16, 6, 0.2]} />
        <meshStandardMaterial color="#181A22" roughness={0.85} metalness={0.12} />
      </mesh>
      <mesh position={[-8, 3, 0]}>
        <boxGeometry args={[0.2, 6, 16]} />
        <meshStandardMaterial color="#1B1E28" roughness={0.85} metalness={0.12} />
      </mesh>
      <mesh position={[8, 3, 0]}>
        <boxGeometry args={[0.2, 6, 16]} />
        <meshStandardMaterial color="#1B1E28" roughness={0.85} metalness={0.12} />
      </mesh>

      <mesh position={[0, 6.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#090A10" roughness={0.95} metalness={0.04} />
      </mesh>

      <Text position={[0, 5.45, -7.3]} color={room.color} fontSize={0.46} anchorX="center" anchorY="middle">
        {room.name}
      </Text>

      {frames.map((frame) => (
        <ArtworkFrame
          key={frame.artwork.id}
          artwork={frame.artwork}
          position={frame.position}
          rotation={frame.rotation}
          selected={selectedArtworkId === frame.artwork.id}
          onSelect={() => onSelectArtwork(frame.artwork, frame.focus)}
        />
      ))}

      <AvatarArms walking={walking} />
      <CameraFocusController focusTarget={focusTarget} />
      <FirstPersonMovement disabled={Boolean(focusTarget)} onMovingChange={onMovingChange} />
    </>
  );
}

export function ImmersiveRoomExperience({ room, artworks, rooms, onSwitchRoom, onExit }: ImmersiveRoomExperienceProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<FrameFocusTarget | null>(null);
  const [focusTarget, setFocusTarget] = useState<FrameFocusTarget | null>(null);
  const [walking, setWalking] = useState(false);
  useFootstepAudio(walking);

  const playNarration = useCallback(() => {
    if (!selectedArtwork || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(selectedArtwork.audioScript);
    utterance.lang = 'en-US';
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  }, [selectedArtwork]);

  useEffect(() => {
    setSelectedArtwork(null);
    setSelectedTarget(null);
    setFocusTarget(null);
    setWalking(false);
  }, [room.id]);

  useEffect(() => () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return (
    <div className="mt-8 space-y-5">
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-museum-gold">Immersive Room Mode</p>
            <h3 className="mt-2 font-display text-3xl text-white">{room.name}</h3>
            <p className="mt-2 text-sm text-white/65">Click inside the 3D view to lock cursor, then use W A S D (or arrow keys) and mouse to walk and look around 360 degrees. Click any frame to inspect and narrate.</p>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="rounded-full border border-white/12 bg-white/5 px-5 py-2 text-sm text-white/85 transition hover:border-museum-gold/40 hover:text-white"
          >
            Exit to Lobby
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {rooms.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSwitchRoom(entry.id)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition ${entry.id === room.id ? 'border-museum-gold/45 bg-museum-gold/15 text-museum-gold' : 'border-white/10 bg-white/5 text-white/70 hover:text-white'}`}
            >
              {entry.name}
            </button>
          ))}
        </div>
      </GlassCard>

      <div className="h-[70vh] min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_34%),linear-gradient(180deg,#101118,#07070a)]">
        <Canvas camera={{ position: [0, 1.7, 4], fov: 70 }} shadows>
          <RoomScene
            room={room}
            artworks={artworks}
            selectedArtworkId={selectedArtwork?.id ?? null}
            onSelectArtwork={(artwork, target) => {
              setSelectedArtwork(artwork);
              setSelectedTarget(target);
            }}
            focusTarget={focusTarget}
            onMovingChange={setWalking}
            walking={walking}
          />
        </Canvas>
      </div>

      {selectedArtwork ? (
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-museum-gold">Selected Frame</p>
          <h4 className="mt-2 font-display text-3xl text-white">{selectedArtwork.title}</h4>
          <p className="mt-2 text-sm uppercase tracking-[0.16em] text-white/60">{selectedArtwork.artist} • {selectedArtwork.year}</p>
          <p className="mt-3 text-white/70">{selectedArtwork.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (selectedTarget) {
                  setFocusTarget(selectedTarget);
                }
              }}
              className="rounded-full border border-museum-gold/35 bg-museum-gold/15 px-4 py-2 text-sm text-museum-gold transition hover:bg-museum-gold/24"
            >
              Zoom to frame
            </button>
            <button
              type="button"
              onClick={() => setFocusTarget(null)}
              className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:border-museum-gold/40 hover:text-white"
            >
              Release zoom
            </button>
            <button
              type="button"
              onClick={playNarration}
              className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:border-museum-gold/40 hover:text-white"
            >
              Listen narration
            </button>
            <Link
              to={`/painting/${selectedArtwork.id}`}
              className="rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:border-museum-gold/40 hover:text-white"
            >
              Open details page
            </Link>
          </div>
        </GlassCard>
      ) : null}

      <GlassCard className="p-4 text-sm text-white/70">
        <p>
          Want artwork details while walking? Open any work from the room spotlight below or from the{' '}
          <Link to="/gallery" className="text-museum-gold underline underline-offset-4">gallery</Link>.
        </p>
      </GlassCard>
    </div>
  );
}