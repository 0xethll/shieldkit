'use client'

import Lottie from 'lottie-react'

// Simplified encryption animation data
const encryptionAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: 'Encryption',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Lock',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], e: [360] },
            { t: 120, s: [360] },
          ],
        },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], e: [120, 120, 100] },
            { t: 60, s: [120, 120, 100], e: [100, 100, 100] },
            { t: 120, s: [100, 100, 100] },
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
              s: { a: 0, k: [40, 50] },
              p: { a: 0, k: [0, 10] },
              r: { a: 0, k: 5 },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.234, 0.51, 0.961, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
            },
            {
              ty: 'fl',
              c: { a: 0, k: [0.627, 0.318, 0.961, 0.3] },
              o: { a: 0, k: 100 },
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
        {
          ty: 'gr',
          it: [
            {
              ty: 'el',
              d: 1,
              s: { a: 0, k: [30, 30] },
              p: { a: 0, k: [0, -15] },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.234, 0.51, 0.961, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 4 },
            },
            { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
      ip: 0,
      op: 120,
      st: 0,
    },
  ],
}

export function LottieEncryption({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <Lottie animationData={encryptionAnimation} loop={true} />
    </div>
  )
}
