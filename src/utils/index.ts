export const scalarLength = (v: number[]) =>
  Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

export const getAcceleration = (G: number, M: number, R: number) =>
  (G * M) / R ** 2;

type velocityFn = (m1: number, v1: number, m2: number, v2: number) => number;
export const getVelocityAfterCollision: velocityFn = (m1, v1, m2, v2) =>
  (m1 * v1 + m2 * v2) / (m1 + m2);

export const scaleFromMass = (mass: number) =>
  ((3 * mass) / (4 * Math.PI)) ** (1 / 3);

export const massFromScale = (scale: number) => (Math.PI * 4 * scale ** 3) / 3;
