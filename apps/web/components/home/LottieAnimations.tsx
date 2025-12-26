'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'

// Lottie animation URLs from LottieFiles (public domain)
const ANIMATION_URLS = {
  encryption: 'https://lottie.host/b4c5c0c3-4d5d-4c6e-8f9e-1a2b3c4d5e6f/xyz.json', // Placeholder
  security: 'https://lottie.host/a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p/abc.json', // Placeholder
  lock: 'https://lottie.host/c7d8e9f0-1a2b-3c4d-5e6f-7g8h9i0j1k2l/def.json', // Placeholder
}

// Fallback animation data for encryption
const encryptionFallback = {
  v: '5.9.0',
  fr: 30,
  ip: 0,
  op: 90,
  w: 400,
  h: 400,
  nm: 'Encryption Animation',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Circle',
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [100] },
            { t: 15, s: [100], e: [0] },
            { t: 30, s: [0] },
          ],
        },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360] },
            { t: 90, s: [360] },
          ],
        },
        p: { a: 0, k: [200, 200, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 15, s: [100, 100, 100], e: [120, 120, 100] },
            { t: 30, s: [120, 120, 100], e: [0, 0, 100] },
            { t: 45, s: [0, 0, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [100, 100] },
              p: { a: 0, k: [0, 0] },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.231, 0.506, 0.961, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 8 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 0,
      op: 90,
      st: 0,
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: 'Lock Body',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 220, 0] },
        s: {
          a: 1,
          k: [
            { t: 45, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'rc',
              d: 1,
              s: { a: 0, k: [80, 100] },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 10 },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.627, 0.318, 0.961, 1] },
              o: { a: 0, k: 100 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 45,
      op: 90,
      st: 0,
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: 'Lock Arc',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 180, 0] },
        s: {
          a: 1,
          k: [
            { t: 45, s: [0, 0, 100], e: [100, 100, 100] },
            { t: 60, s: [100, 100, 100] },
          ],
        },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              d: 1,
              ty: 'el',
              s: { a: 0, k: [60, 60] },
              p: { a: 0, k: [0, 0] },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.627, 0.318, 0.961, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 12 },
            },
            {
              ty: 'tm',
              s: { a: 0, k: 0 },
              e: { a: 0, k: 50 },
              o: { a: 0, k: 0 },
              m: 1,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
      ip: 45,
      op: 90,
      st: 0,
    },
  ],
}

interface LottieAnimationProps {
  type?: 'encryption' | 'security' | 'lock'
  className?: string
  size?: number
}

export function LottieAnimation({
  type = 'encryption',
  className = '',
  size = 200,
}: LottieAnimationProps) {
  const [animationData, setAnimationData] = useState<typeof encryptionFallback>(encryptionFallback)

  // Use fallback animation directly for better reliability
  useEffect(() => {
    setAnimationData(encryptionFallback)
  }, [type])

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  )
}

// Pre-configured animations
export function EncryptionLottie({ className = '' }: { className?: string }) {
  return <LottieAnimation type="encryption" className={className} size={150} />
}

export function SecurityLottie({ className = '' }: { className?: string }) {
  return <LottieAnimation type="security" className={className} size={100} />
}

export function LockLottie({ className = '' }: { className?: string }) {
  return <LottieAnimation type="lock" className={className} size={80} />
}
