import React, { useMemo } from 'react';
import {
  ChassisGeometryConfig,
  ExteriorDetailsConfig,
  InteriorOption,
  PBRCustomSettings,
  VehicleArchetype,
  WheelOption,
} from '../../types/configurator';

interface DemoProceduralCarProps {
  archetype: VehicleArchetype;
  pbr: PBRCustomSettings;
  exteriorDetails: ExteriorDetailsConfig;
  chassisConfig: ChassisGeometryConfig;
  wheel: WheelOption;
  interior: InteriorOption;
  activeAccessories: {
    spoiler: boolean;
    frontSplitter: boolean;
    aeroCanards: boolean;
    sideSkirts: boolean;
    roofScoop: boolean;
    panoramicRoof: boolean;
    roofRack: boolean;
    sportTrim: boolean;
    underglow: boolean;
  };
}

/**
 * Roda 3D Detalhada com 6 Estilos:
 * sport | premium | black | racing | aerodisc | offroad
 */
const DetailedWheel3D: React.FC<{
  position: [number, number, number];
  isLeft: boolean;
  wheel: WheelOption;
  radius: number;
  width: number;
  caliperColor: string;
}> = ({ position, isLeft, wheel, radius, width, caliperColor }) => {
  const spokeCount =
    wheel.style === 'sport'
      ? 5
      : wheel.style === 'premium'
      ? 12
      : wheel.style === 'black'
      ? 7
      : wheel.style === 'offroad'
      ? 8
      : 6;

  const spokes = useMemo(
    () =>
      Array.from(
        { length: spokeCount },
        (_, i) => (i * Math.PI * 2) / spokeCount
      ),
    [spokeCount]
  );

  const sign = isLeft ? 1 : -1;

  return (
    <group position={position}>
      {/* Pneu de borracha */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, width, 32]} />
        <meshStandardMaterial color="#121316" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Ombro arredondado externo do pneu */}
      <mesh
        position={[sign * (width * 0.46), 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry
          args={[
            radius * 0.85,
            radius * (wheel.style === 'offroad' ? 0.19 : 0.15),
            14,
            32,
          ]}
        />
        <meshStandardMaterial color="#141519" roughness={0.82} metalness={0.1} />
      </mesh>

      {/* Aro metálico externo */}
      <mesh
        position={[sign * (width * 0.48), 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <torusGeometry args={[radius * 0.71, radius * 0.048, 14, 32]} />
        <meshStandardMaterial
          color={
            wheel.style === 'offroad' ? wheel.accentColor : wheel.primaryColor
          }
          metalness={wheel.metalness}
          roughness={wheel.roughness}
        />
      </mesh>

      {/* Tambor interno da roda */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry
          args={[radius * 0.71, radius * 0.71, width * 0.92, 28]}
        />
        <meshStandardMaterial
          color={wheel.accentColor}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Disco de freio ventilado */}
      <mesh
        position={[sign * (width * 0.15), 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry args={[radius * 0.56, radius * 0.56, 0.04, 28]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Pinça de freio esportiva (Caliper customizável!) */}
      <mesh
        position={[sign * (width * 0.22), radius * 0.22, -radius * 0.34]}
        rotation={[0.5, 0, 0]}
      >
        <boxGeometry args={[0.095, radius * 0.36, radius * 0.23]} />
        <meshStandardMaterial
          color={caliperColor}
          metalness={0.65}
          roughness={0.22}
        />
      </mesh>

      {/* Estilo AeroDisc Fechado ou Raios Abertos */}
      <group position={[sign * (width * 0.45), 0, 0]}>
        {wheel.style === 'aerodisc' ? (
          <>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry
                args={[radius * 0.69, radius * 0.69, 0.03, 32]}
              />
              <meshStandardMaterial
                color={wheel.primaryColor}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh
              position={[sign * 0.018, 0, 0]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <ringGeometry args={[radius * 0.48, radius * 0.56, 32]} />
              <meshBasicMaterial color={wheel.accentColor} side={2} />
            </mesh>
          </>
        ) : (
          spokes.map((angle, idx) => (
            <group key={idx} rotation={[angle, 0, 0]}>
              {wheel.style === 'sport' && (
                <>
                  <mesh position={[0, radius * 0.35, 0.025]}>
                    <boxGeometry args={[0.035, radius * 0.66, 0.022]} />
                    <meshStandardMaterial
                      color={wheel.primaryColor}
                      metalness={wheel.metalness}
                      roughness={wheel.roughness}
                    />
                  </mesh>
                  <mesh position={[0, radius * 0.35, -0.025]}>
                    <boxGeometry args={[0.035, radius * 0.66, 0.022]} />
                    <meshStandardMaterial
                      color={wheel.primaryColor}
                      metalness={wheel.metalness}
                      roughness={wheel.roughness}
                    />
                  </mesh>
                </>
              )}

              {wheel.style === 'premium' && (
                <mesh position={[0, radius * 0.35, 0]}>
                  <boxGeometry args={[0.032, radius * 0.68, 0.018]} />
                  <meshStandardMaterial
                    color={wheel.primaryColor}
                    metalness={wheel.metalness}
                    roughness={wheel.roughness}
                  />
                </mesh>
              )}

              {(wheel.style === 'black' || wheel.style === 'offroad') && (
                <mesh position={[0, radius * 0.34, 0]}>
                  <boxGeometry
                    args={[
                      0.045,
                      radius * 0.66,
                      wheel.style === 'offroad' ? 0.06 : 0.042,
                    ]}
                  />
                  <meshStandardMaterial
                    color={wheel.primaryColor}
                    metalness={wheel.metalness}
                    roughness={wheel.roughness}
                  />
                </mesh>
              )}

              {wheel.style === 'racing' && (
                <>
                  <mesh
                    position={[0, radius * 0.34, 0.018]}
                    rotation={[0.18, 0, 0]}
                  >
                    <boxGeometry args={[0.035, radius * 0.66, 0.02]} />
                    <meshStandardMaterial
                      color={wheel.primaryColor}
                      metalness={wheel.metalness}
                      roughness={wheel.roughness}
                    />
                  </mesh>
                  <mesh
                    position={[0, radius * 0.34, -0.018]}
                    rotation={[-0.18, 0, 0]}
                  >
                    <boxGeometry args={[0.035, radius * 0.66, 0.02]} />
                    <meshStandardMaterial
                      color={wheel.primaryColor}
                      metalness={wheel.metalness}
                      roughness={wheel.roughness}
                    />
                  </mesh>
                </>
              )}
            </group>
          ))
        )}

        {/* Cubo central da roda */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.16, radius * 0.16, 0.06, 20]} />
          <meshStandardMaterial
            color={
              wheel.style === 'racing' || wheel.style === 'aerodisc'
                ? caliperColor
                : '#0F172A'
            }
            metalness={0.85}
            roughness={0.2}
          />
        </mesh>
      </group>
    </group>
  );
};

/**
 * Renderizador 3D Paramétrico Universal com 6 Arquétipos + Engenharia de Chassi + 9 Acessórios
 */
export const DemoProceduralCar: React.FC<DemoProceduralCarProps> = ({
  archetype,
  pbr,
  exteriorDetails,
  chassisConfig,
  wheel,
  interior,
  activeAccessories,
}) => {
  // Calcula as dimensões combinando o arquétipo base com os sliders de Engenharia de Chassi
  const dims = useMemo(() => {
    let base = {
      wheelRadius: 0.37,
      wheelWidth: 0.27,
      trackWidth: 0.88,
      wheelbaseHalf: 1.35,
      chassisY: 0.44,
      chassisHeight: 0.42,
      chassisWidth: 1.86,
      chassisLength: 4.25,
      cabinY: 0.84,
      cabinHeight: 0.42,
      cabinWidth: 1.54,
      cabinLength: 2.1,
      cabinZ: -0.12,
      seatY: 0.62,
    };

    if (archetype === 'suv') {
      base = {
        wheelRadius: 0.42,
        wheelWidth: 0.28,
        trackWidth: 0.92,
        wheelbaseHalf: 1.42,
        chassisY: 0.56,
        chassisHeight: 0.52,
        chassisWidth: 1.92,
        chassisLength: 4.35,
        cabinY: 1.08,
        cabinHeight: 0.52,
        cabinWidth: 1.66,
        cabinLength: 2.55,
        cabinZ: -0.22,
        seatY: 0.85,
      };
    } else if (archetype === 'hypercar') {
      base = {
        wheelRadius: 0.36,
        wheelWidth: 0.31,
        trackWidth: 0.94,
        wheelbaseHalf: 1.38,
        chassisY: 0.38,
        chassisHeight: 0.36,
        chassisWidth: 1.98,
        chassisLength: 4.45,
        cabinY: 0.72,
        cabinHeight: 0.36,
        cabinWidth: 1.42,
        cabinLength: 1.95,
        cabinZ: 0.05,
        seatY: 0.52,
      };
    } else if (archetype === 'sedan') {
      base = {
        wheelRadius: 0.38,
        wheelWidth: 0.26,
        trackWidth: 0.89,
        wheelbaseHalf: 1.48,
        chassisY: 0.46,
        chassisHeight: 0.44,
        chassisWidth: 1.88,
        chassisLength: 4.65,
        cabinY: 0.88,
        cabinHeight: 0.45,
        cabinWidth: 1.58,
        cabinLength: 2.45,
        cabinZ: -0.08,
        seatY: 0.65,
      };
    } else if (archetype === 'pickup') {
      base = {
        wheelRadius: 0.45,
        wheelWidth: 0.31,
        trackWidth: 0.96,
        wheelbaseHalf: 1.56,
        chassisY: 0.64,
        chassisHeight: 0.54,
        chassisWidth: 1.98,
        chassisLength: 4.75,
        cabinY: 1.16,
        cabinHeight: 0.52,
        cabinWidth: 1.7,
        cabinLength: 1.85,
        cabinZ: 0.35,
        seatY: 0.92,
      };
    } else if (archetype === 'roadster') {
      base = {
        wheelRadius: 0.36,
        wheelWidth: 0.28,
        trackWidth: 0.9,
        wheelbaseHalf: 1.3,
        chassisY: 0.4,
        chassisHeight: 0.39,
        chassisWidth: 1.88,
        chassisLength: 4.15,
        cabinY: 0.78,
        cabinHeight: 0.36,
        cabinWidth: 1.52,
        cabinLength: 1.85,
        cabinZ: -0.1,
        seatY: 0.56,
      };
    }

    const wScale = chassisConfig.bodyWidthScale || 1;
    const lScale = chassisConfig.bodyLengthScale || 1;
    const cScale = chassisConfig.cabinHeightScale || 1;
    const rScale = chassisConfig.wheelScale || 1;
    const rideOffset = chassisConfig.rideHeightOffset || 0;

    return {
      wheelRadius: base.wheelRadius * rScale,
      wheelWidth: base.wheelWidth * wScale,
      trackWidth: base.trackWidth * wScale,
      wheelbaseHalf: base.wheelbaseHalf * lScale,
      chassisY: base.chassisY + rideOffset,
      chassisHeight: base.chassisHeight,
      chassisWidth: base.chassisWidth * wScale,
      chassisLength: base.chassisLength * lScale,
      cabinY: base.cabinY + rideOffset,
      cabinHeight: base.cabinHeight * cScale,
      cabinWidth: base.cabinWidth * wScale,
      cabinLength: base.cabinLength * lScale,
      cabinZ: base.cabinZ * lScale,
      seatY: base.seatY + rideOffset,
    };
  }, [archetype, chassisConfig]);

  const effectiveRoughness =
    pbr.finishPreset === 'matte'
      ? Math.max(0.45, pbr.roughness)
      : Math.max(0.05, pbr.roughness * (1 - pbr.clearcoat * 0.45));

  const bodyPaintMaterial = (
    <meshStandardMaterial
      color={pbr.color}
      metalness={pbr.metalness}
      roughness={effectiveRoughness}
      envMapIntensity={
        pbr.finishPreset === 'matte' ? 0.6 : 1.15 + pbr.clearcoat * 0.5
      }
    />
  );

  const carbonHoodMaterial = (
    <meshStandardMaterial
      color="#14161D"
      metalness={0.65}
      roughness={0.28}
      envMapIntensity={1.1}
    />
  );

  const trimMaterial = (
    <meshStandardMaterial
      color={activeAccessories.sportTrim ? '#111318' : '#1E222D'}
      metalness={0.75}
      roughness={activeAccessories.sportTrim ? 0.2 : 0.4}
    />
  );

  const isConvertible = archetype === 'roadster';
  const isPickup = archetype === 'pickup';

  return (
    <group position={[0, 0, 0]}>
      {/* =========================================================
          1. CARROCERIA PRINCIPAL (PINTURA PBR + FAIXAS LIVERY)
         ========================================================= */}
      <group>
        {/* Chassi Principal */}
        <mesh position={[0, dims.chassisY, 0]}>
          <boxGeometry
            args={[dims.chassisWidth, dims.chassisHeight, dims.chassisLength]}
          />
          {bodyPaintMaterial}
        </mesh>

        {/* Capô Dianteiro */}
        <mesh
          position={[
            0,
            dims.chassisY + dims.chassisHeight * 0.32,
            dims.chassisLength * 0.31,
          ]}
          rotation={[archetype === 'hypercar' ? 0.16 : 0.08, 0, 0]}
        >
          <boxGeometry
            args={[
              dims.chassisWidth * 0.92,
              dims.chassisHeight * 0.45,
              dims.chassisLength * 0.36,
            ]}
          />
          {exteriorDetails.liveryStyle === 'carbon-hood'
            ? carbonHoodMaterial
            : bodyPaintMaterial}
        </mesh>

        {/* Faixas Esportivas de Corrida (Racing Stripes) */}
        {exteriorDetails.liveryStyle === 'center-stripe' && (
          <mesh
            position={[
              0,
              dims.chassisY + dims.chassisHeight * 0.52,
              0,
            ]}
          >
            <boxGeometry args={[0.24, 0.02, dims.chassisLength * 0.99]} />
            <meshStandardMaterial
              color={exteriorDetails.liveryColor}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
        )}

        {exteriorDetails.liveryStyle === 'dual-stripe' &&
          [-0.14, 0.14].map((xOffset) => (
            <mesh
              key={xOffset}
              position={[
                xOffset,
                dims.chassisY + dims.chassisHeight * 0.52,
                0,
              ]}
            >
              <boxGeometry args={[0.14, 0.02, dims.chassisLength * 0.99]} />
              <meshStandardMaterial
                color={exteriorDetails.liveryColor}
                roughness={0.2}
                metalness={0.5}
              />
            </mesh>
          ))}

        {/* Para-lamas Dianteiros e Traseiros */}
        {[-1, 1].map((side) => (
          <React.Fragment key={side}>
            <mesh
              position={[
                side * (dims.chassisWidth * 0.48),
                dims.chassisY + 0.06,
                dims.wheelbaseHalf,
              ]}
            >
              <boxGeometry
                args={[
                  0.16,
                  dims.chassisHeight * 0.85,
                  dims.wheelRadius * 2.35,
                ]}
              />
              {bodyPaintMaterial}
            </mesh>

            <mesh
              position={[
                side * (dims.chassisWidth * 0.49),
                dims.chassisY + 0.08,
                -dims.wheelbaseHalf,
              ]}
            >
              <boxGeometry
                args={[
                  0.18,
                  dims.chassisHeight * 0.92,
                  dims.wheelRadius * 2.45,
                ]}
              />
              {bodyPaintMaterial}
            </mesh>
          </React.Fragment>
        ))}

        {/* Teto da Cabine (Oculto caso seja Roadster Conversível!) */}
        {!isConvertible && (
          <mesh
            position={[
              0,
              dims.cabinY + dims.cabinHeight * 0.42,
              dims.cabinZ - (isPickup ? 0 : 0.1),
            ]}
          >
            <boxGeometry
              args={[
                dims.cabinWidth * 0.92,
                0.07,
                dims.cabinLength * (isPickup ? 0.78 : 0.62),
              ]}
            />
            {activeAccessories.panoramicRoof ? (
              <meshStandardMaterial
                color="#090D16"
                metalness={0.9}
                roughness={0.05}
                transparent
                opacity={0.85}
              />
            ) : exteriorDetails.liveryStyle === 'carbon-hood' ? (
              carbonHoodMaterial
            ) : (
              bodyPaintMaterial
            )}
          </mesh>
        )}

        {/* Arcos de Proteção (Roll Hoops) exclusivos para o Roadster Conversível */}
        {isConvertible &&
          [-0.34, 0.34].map((xPos) => (
            <mesh
              key={`hoop-${xPos}`}
              position={[xPos, dims.seatY + 0.58, dims.cabinZ - 0.32]}
            >
              <torusGeometry args={[0.14, 0.028, 12, 24, Math.PI]} />
              <meshStandardMaterial
                color="#1E293B"
                metalness={0.85}
                roughness={0.2}
              />
            </mesh>
          ))}

        {/* Deck Traseiro / Caçamba da Picape */}
        {isPickup ? (
          <group
            position={[
              0,
              dims.chassisY + dims.chassisHeight * 0.45,
              -dims.chassisLength * 0.28,
            ]}
          >
            {/* Laterais da Caçamba */}
            {[-1, 1].map((side) => (
              <mesh
                key={`bed-${side}`}
                position={[side * (dims.chassisWidth * 0.44), 0.08, 0]}
              >
                <boxGeometry
                  args={[0.12, 0.32, dims.chassisLength * 0.38]}
                />
                {bodyPaintMaterial}
              </mesh>
            ))}
            {/* Piso revestido da caçamba */}
            <mesh position={[0, -0.05, 0]}>
              <boxGeometry
                args={[
                  dims.chassisWidth * 0.82,
                  0.05,
                  dims.chassisLength * 0.36,
                ]}
              />
              <meshStandardMaterial color="#14161D" roughness={0.8} />
            </mesh>
          </group>
        ) : (
          <mesh
            position={[
              0,
              dims.chassisY + dims.chassisHeight * 0.42,
              -dims.chassisLength * 0.32,
            ]}
            rotation={[archetype === 'suv' ? -0.04 : -0.18, 0, 0]}
          >
            <boxGeometry
              args={[
                dims.chassisWidth * 0.9,
                dims.chassisHeight * 0.5,
                dims.chassisLength * 0.34,
              ]}
            />
            {bodyPaintMaterial}
          </mesh>
        )}

        {/* Retrovisores Laterais */}
        {[-1, 1].map((side) => (
          <group
            key={`mirror-${side}`}
            position={[
              side * (dims.chassisWidth * 0.54),
              dims.chassisY + dims.chassisHeight * 0.62,
              dims.wheelbaseHalf * 0.48,
            ]}
          >
            <mesh>
              <boxGeometry args={[0.2, 0.09, 0.14]} />
              {activeAccessories.sportTrim ? trimMaterial : bodyPaintMaterial}
            </mesh>
          </group>
        ))}
      </group>

      {/* =========================================================
          2. VIDROS COM NÍVEL DE INSULFILM / PELÍCULA CUSTOMIZÁVEL
         ========================================================= */}
      <group>
        {/* Parabrisa Dianteiro */}
        <mesh
          position={[0, dims.cabinY, dims.cabinZ + dims.cabinLength * 0.38]}
          rotation={[-0.58, 0, 0]}
        >
          <boxGeometry
            args={[dims.cabinWidth * 0.88, 0.04, dims.cabinHeight * 1.45]}
          />
          <meshStandardMaterial
            color="#0B1320"
            metalness={0.4}
            roughness={0.05}
            transparent
            opacity={exteriorDetails.windowTintOpacity}
          />
        </mesh>

        {/* Vidro Traseiro e Janelas Laterais (Apenas se não for Roadster aberto) */}
        {!isConvertible && (
          <>
            <mesh
              position={[
                0,
                dims.cabinY,
                dims.cabinZ - dims.cabinLength * 0.44,
              ]}
              rotation={[
                archetype === 'suv' || isPickup ? 0.18 : 0.62,
                0,
                0,
              ]}
            >
              <boxGeometry
                args={[dims.cabinWidth * 0.86, 0.04, dims.cabinHeight * 1.35]}
              />
              <meshStandardMaterial
                color="#0B1320"
                metalness={0.4}
                roughness={0.06}
                transparent
                opacity={exteriorDetails.windowTintOpacity}
              />
            </mesh>

            {[-1, 1].map((side) => (
              <mesh
                key={`window-${side}`}
                position={[
                  side * (dims.cabinWidth * 0.46),
                  dims.cabinY,
                  dims.cabinZ - 0.05,
                ]}
                rotation={[0, 0, side * -0.18]}
              >
                <boxGeometry
                  args={[
                    0.04,
                    dims.cabinHeight * 0.78,
                    dims.cabinLength * 0.66,
                  ]}
                />
                <meshStandardMaterial
                  color="#0B1320"
                  metalness={0.35}
                  roughness={0.05}
                  transparent
                  opacity={exteriorDetails.windowTintOpacity}
                />
              </mesh>
            ))}
          </>
        )}
      </group>

      {/* =========================================================
          3. INTERIOR DETALHADO (COCKPIT)
         ========================================================= */}
      <group>
        <mesh position={[0, dims.seatY - 0.14, dims.cabinZ]}>
          <boxGeometry
            args={[dims.cabinWidth * 0.82, 0.18, dims.cabinLength * 0.72]}
          />
          <meshStandardMaterial
            color={interior.secondaryColor}
            roughness={0.75}
          />
        </mesh>

        <mesh position={[0, dims.seatY - 0.02, dims.cabinZ + 0.05]}>
          <boxGeometry args={[0.24, 0.22, 1.25]} />
          <meshStandardMaterial
            color={interior.primaryColor}
            roughness={interior.roughness}
          />
        </mesh>

        {[-0.34, 0.34].map((xPos, idx) => (
          <group
            key={`seat-${idx}`}
            position={[xPos, dims.seatY, dims.cabinZ - 0.08]}
          >
            <mesh position={[0, 0, 0.08]}>
              <boxGeometry args={[0.44, 0.12, 0.48]} />
              <meshStandardMaterial
                color={interior.primaryColor}
                roughness={interior.roughness}
              />
            </mesh>
            <mesh position={[0, 0.28, -0.12]} rotation={[-0.18, 0, 0]}>
              <boxGeometry args={[0.42, 0.54, 0.11]} />
              <meshStandardMaterial
                color={interior.primaryColor}
                roughness={interior.roughness}
              />
            </mesh>
            <mesh position={[0, 0.28, -0.06]} rotation={[-0.18, 0, 0]}>
              <boxGeometry args={[0.18, 0.46, 0.02]} />
              <meshStandardMaterial
                color={interior.secondaryColor}
                roughness={interior.roughness}
              />
            </mesh>
            <mesh position={[0, 0.58, -0.18]}>
              <boxGeometry args={[0.24, 0.18, 0.09]} />
              <meshStandardMaterial
                color={interior.primaryColor}
                roughness={interior.roughness}
              />
            </mesh>
          </group>
        ))}

        <group position={[0, dims.seatY + 0.22, dims.cabinZ + 0.55]}>
          <mesh>
            <boxGeometry args={[dims.cabinWidth * 0.82, 0.22, 0.38]} />
            <meshStandardMaterial
              color={interior.secondaryColor}
              roughness={0.55}
            />
          </mesh>
          <mesh position={[0, 0.08, -0.16]}>
            <boxGeometry args={[dims.cabinWidth * 0.78, 0.05, 0.08]} />
            <meshStandardMaterial color={interior.primaryColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.06, -0.195]}>
            <boxGeometry args={[0.32, 0.15, 0.02]} />
            <meshBasicMaterial color={interior.stitchingColor} />
          </mesh>
          <group position={[-0.32, 0.04, -0.24]} rotation={[0.25, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.14, 0.022, 12, 24]} />
              <meshStandardMaterial
                color={interior.primaryColor}
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0, 0.14, 0]}>
              <boxGeometry args={[0.025, 0.03, 0.03]} />
              <meshBasicMaterial color={interior.stitchingColor} />
            </mesh>
          </group>
        </group>
      </group>

      {/* =========================================================
          4. FARÓIS LED (COM COR E FEIXE NO PISO), LANTERNAS E GRADES
         ========================================================= */}
      <group>
        {[-1, 1].map((side) => (
          <React.Fragment key={`headlight-${side}`}>
            <mesh
              position={[
                side * (dims.chassisWidth * 0.35),
                dims.chassisY + 0.08,
                dims.chassisLength * 0.495,
              ]}
            >
              <boxGeometry args={[0.36, 0.065, 0.06]} />
              <meshBasicMaterial
                color={
                  exteriorDetails.headlightsOn
                    ? exteriorDetails.headlightColor
                    : '#334155'
                }
              />
            </mesh>

            {/* Projeção luminosa dos faróis no piso quando ligados */}
            {exteriorDetails.headlightsOn && (
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[
                  side * (dims.chassisWidth * 0.35),
                  0.008,
                  dims.chassisLength * 0.495 + 1.1,
                ]}
              >
                <planeGeometry args={[0.65, 1.8]} />
                <meshBasicMaterial
                  color={exteriorDetails.headlightColor}
                  transparent
                  opacity={0.18}
                />
              </mesh>
            )}
          </React.Fragment>
        ))}

        {/* Grade Frontal */}
        <mesh position={[0, dims.chassisY - 0.08, dims.chassisLength * 0.501]}>
          <boxGeometry args={[dims.chassisWidth * 0.58, 0.2, 0.03]} />
          {trimMaterial}
        </mesh>

        {/* Barra de LED Traseira */}
        <mesh
          position={[
            0,
            dims.chassisY + dims.chassisHeight * 0.25,
            -dims.chassisLength * 0.501,
          ]}
        >
          <boxGeometry args={[dims.chassisWidth * 0.84, 0.055, 0.04]} />
          <meshBasicMaterial color="#EF4444" />
        </mesh>

        {/* Difusor Traseiro */}
        <mesh position={[0, dims.chassisY - 0.14, -dims.chassisLength * 0.49]}>
          <boxGeometry args={[dims.chassisWidth * 0.78, 0.16, 0.08]} />
          {trimMaterial}
        </mesh>
      </group>

      {/* =========================================================
          5. NOVE ACESSÓRIOS 3D ATIVÁVEIS EM TEMPO REAL
         ========================================================= */}
      {/* 5.1. Aerofólio Traseiro GT */}
      {activeAccessories.spoiler && (
        <group
          position={[
            0,
            dims.chassisY + dims.chassisHeight * 0.75,
            -dims.chassisLength * 0.45,
          ]}
        >
          {[-0.45, 0.45].map((x) => (
            <mesh key={x} position={[x, -0.08, 0]} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.04, 0.22, 0.18]} />
              <meshStandardMaterial color="#111318" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
          <mesh position={[0, 0.04, -0.04]} rotation={[0.08, 0, 0]}>
            <boxGeometry args={[dims.chassisWidth * 0.94, 0.04, 0.32]} />
            <meshStandardMaterial color="#14171F" metalness={0.75} roughness={0.22} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={`endplate-${side}`}
              position={[side * (dims.chassisWidth * 0.47), 0.04, -0.04]}
            >
              <boxGeometry args={[0.025, 0.14, 0.36]} />
              <meshStandardMaterial
                color={
                  activeAccessories.sportTrim
                    ? exteriorDetails.caliperColor
                    : pbr.color
                }
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 5.2. Spoiler Dianteiro (Front Splitter) */}
      {activeAccessories.frontSplitter && (
        <group
          position={[
            0,
            dims.chassisY - dims.chassisHeight * 0.48,
            dims.chassisLength * 0.5,
          ]}
        >
          <mesh>
            <boxGeometry args={[dims.chassisWidth * 0.98, 0.045, 0.26]} />
            <meshStandardMaterial color="#111318" metalness={0.8} roughness={0.2} />
          </mesh>
          {activeAccessories.sportTrim && (
            <mesh position={[0, -0.015, 0.12]}>
              <boxGeometry args={[dims.chassisWidth * 0.99, 0.015, 0.03]} />
              <meshBasicMaterial color={exteriorDetails.caliperColor} />
            </mesh>
          )}
        </group>
      )}

      {/* 5.3. Canards Dianteiros de Pista */}
      {activeAccessories.aeroCanards &&
        [-1, 1].map((side) => (
          <group
            key={`canard-${side}`}
            position={[
              side * (dims.chassisWidth * 0.51),
              dims.chassisY - 0.06,
              dims.chassisLength * 0.46,
            ]}
            rotation={[0.25, 0, side * -0.15]}
          >
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.09, 0.02, 0.22]} />
              <meshStandardMaterial color="#111318" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.02, 0.02]}>
              <boxGeometry args={[0.1, 0.02, 0.18]} />
              <meshStandardMaterial color="#111318" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}

      {/* 5.4. Saias Laterais Esportivas */}
      {activeAccessories.sideSkirts &&
        [-1, 1].map((side) => (
          <group
            key={`skirt-${side}`}
            position={[
              side * (dims.chassisWidth * 0.51),
              dims.chassisY - dims.chassisHeight * 0.46,
              0,
            ]}
          >
            <mesh>
              <boxGeometry args={[0.12, 0.045, dims.wheelbaseHalf * 1.45]} />
              <meshStandardMaterial
                color="#111318"
                metalness={0.8}
                roughness={0.22}
              />
            </mesh>
            {activeAccessories.sportTrim && (
              <mesh position={[side * 0.055, -0.01, 0]}>
                <boxGeometry args={[0.015, 0.015, dims.wheelbaseHalf * 1.45]} />
                <meshBasicMaterial color={exteriorDetails.caliperColor} />
              </mesh>
            )}
          </group>
        ))}

      {/* 5.5. Scoop de Teto (Entrada de Ar Superior Le Mans) */}
      {activeAccessories.roofScoop && !isConvertible && (
        <group
          position={[
            0,
            dims.cabinY + dims.cabinHeight * 0.52,
            dims.cabinZ + 0.05,
          ]}
        >
          <mesh>
            <boxGeometry args={[0.32, 0.11, 0.68]} />
            <meshStandardMaterial color="#14161D" metalness={0.75} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0.01, 0.341]}>
            <boxGeometry args={[0.24, 0.06, 0.02]} />
            <meshBasicMaterial color={exteriorDetails.caliperColor} />
          </mesh>
        </group>
      )}

      {/* 5.6. Rack de Teto Expedition */}
      {activeAccessories.roofRack && !isConvertible && (
        <group
          position={[
            0,
            dims.cabinY + dims.cabinHeight * 0.54,
            dims.cabinZ - 0.1,
          ]}
        >
          {[-0.36, 0.36].map((zOffset) => (
            <mesh key={`bar-${zOffset}`} position={[0, 0.04, zOffset]}>
              <boxGeometry args={[dims.cabinWidth * 0.92, 0.035, 0.06]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.25} />
            </mesh>
          ))}
          {[-1, 1].map((side) => (
            <mesh
              key={`rail-${side}`}
              position={[side * (dims.cabinWidth * 0.42), 0.01, 0]}
            >
              <boxGeometry args={[0.04, 0.05, 0.95]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* 5.7. Aletas de Difusor do Pacote Esportivo */}
      {activeAccessories.sportTrim && (
        <group>
          {[-0.55, -0.25, 0.25, 0.55].map((xPos, i) => (
            <mesh
              key={`fin-${i}`}
              position={[
                xPos,
                dims.chassisY - 0.16,
                -dims.chassisLength * 0.52,
              ]}
            >
              <boxGeometry args={[0.025, 0.14, 0.12]} />
              <meshStandardMaterial
                color={exteriorDetails.caliperColor}
                metalness={0.7}
                roughness={0.2}
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 5.8. Kit Neon Underglow no Piso */}
      {activeAccessories.underglow && (
        <group position={[0, 0.009, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry
              args={[dims.chassisWidth * 1.15, dims.chassisLength * 0.92]}
            />
            <meshBasicMaterial
              color={exteriorDetails.underglowColor}
              transparent
              opacity={0.42}
            />
          </mesh>
          <pointLight
            position={[0, 0.18, 0]}
            intensity={2.2}
            distance={3.5}
            color={exteriorDetails.underglowColor}
          />
        </group>
      )}

      {/* =========================================================
          6. QUATRO RODAS 3D INTERATIVAS
         ========================================================= */}
      <DetailedWheel3D
        position={[dims.trackWidth, dims.wheelRadius, dims.wheelbaseHalf]}
        isLeft={true}
        wheel={wheel}
        radius={dims.wheelRadius}
        width={dims.wheelWidth}
        caliperColor={exteriorDetails.caliperColor}
      />
      <DetailedWheel3D
        position={[-dims.trackWidth, dims.wheelRadius, dims.wheelbaseHalf]}
        isLeft={false}
        wheel={wheel}
        radius={dims.wheelRadius}
        width={dims.wheelWidth}
        caliperColor={exteriorDetails.caliperColor}
      />
      <DetailedWheel3D
        position={[dims.trackWidth, dims.wheelRadius, -dims.wheelbaseHalf]}
        isLeft={true}
        wheel={wheel}
        radius={dims.wheelRadius}
        width={dims.wheelWidth}
        caliperColor={exteriorDetails.caliperColor}
      />
      <DetailedWheel3D
        position={[-dims.trackWidth, dims.wheelRadius, -dims.wheelbaseHalf]}
        isLeft={false}
        wheel={wheel}
        radius={dims.wheelRadius}
        width={dims.wheelWidth}
        caliperColor={exteriorDetails.caliperColor}
      />
    </group>
  );
};
