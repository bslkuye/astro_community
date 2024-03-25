import { length } from './mapInfo'

export type ImageInfo = [string, number, number, number]
export const imageInfo: () => ImageInfo[] = () => [
  [
    'blackhole',
    Math.random() * length,
    Math.random() * length,
    Math.random() * 360,
  ],
  [
    'deathStar',
    Math.random() * length,
    Math.random() * length,
    Math.random() * 360,
  ],
  [
    'donut',
    Math.random() * length,
    Math.random() * length,
    Math.random() * 360,
  ],
  [
    'earth',
    Math.random() * length,
    Math.random() * length,
    Math.random() * 360,
  ],
  ['flet', Math.random() * length, Math.random() * length, Math.random() * 360],
  [
    'spaceStation',
    Math.random() * length,
    Math.random() * length,
    Math.random() * 360,
  ],
]
