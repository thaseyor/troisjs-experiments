export const scalarLength = (v) => Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);

export const getAcceleration = (G, M, R) => (G * M) / R ** 2;

export const getVelocityAfterCollision = (m1, v1, m2, v2) =>
  (m1 * v1 + m2 * v2) / (m1 + m2);

export const scaleFromMass = (mass) => ((3 * mass) / (4 * Math.PI)) ** (1 / 3);

export const massFromScale = (scale) => (Math.PI * 4 * scale ** 3) / 3;
