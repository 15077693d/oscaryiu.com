import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Text3D, Float, Center } from '@react-three/drei'
export function Text3DScene() {
  const text = `OscarYiu.com 2.0 \n Is Coming Soon!`
  return (
    <div style={{ width: '100vw', height: '80vh' }}>
      <Canvas>
        <React.Suspense fallback={null}>
          <Center>
            <Float floatIntensity={5} speed={2}>
              <Text3D
                scale={[0.3, 0.3, 0.3]}
                font={'/fonts/Roboto_Black_Regular.json'}
                bevelEnabled
                bevelSize={0.05}
              >
                {text}
                <meshNormalMaterial />
              </Text3D>
            </Float>
          </Center>
        </React.Suspense>
      </Canvas>
    </div>
  )
}
