import { Vector4, Vector3, Vector2 } from "three";

const p = [
  151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140,
  36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234,
  75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237,
  149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48,
  27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105,
  92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73,
  209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
  164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38,
  147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189,
  28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101,
  155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232,
  178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12,
  191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
  181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215,
  61, 156, 180,
];

type Vector = Vector2 | Vector3 | Vector4;
type MapType = (
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) => number;

/**
 * An implimentation of Perlin Noise by Ken Perlin.
 */
export class Perlin {
  _seed: number;
  _offsetMatrix: Vector4[];
  perm: number[];
  gradP: Vector4[];

  constructor(seed: number) {
    const _gradientVecs = [
      // 2D Vecs
      new Vector4(1, 1, 0, 0),
      new Vector4(-1, 1, 0, 0),
      new Vector4(1, -1, 0, 0),
      new Vector4(-1, -1, 0, 0),
      // + 3D Vecs
      new Vector4(1, 0, 1, 0),
      new Vector4(-1, 0, 1, 0),
      new Vector4(1, 0, -1, 0),
      new Vector4(-1, 0, -1, 0),
      new Vector4(0, 1, 1, 0),
      new Vector4(0, -1, 1, 0),
      new Vector4(0, 1, -1, 0),
      new Vector4(0, -1, -1, 0),
      // + 4D Vecs
      new Vector4(1, 0, 1, 1),
      new Vector4(-1, 0, 1, 1),
      new Vector4(1, 0, -1, 1),
      new Vector4(-1, 0, -1, 1),
      new Vector4(0, 1, 1, 1),
      new Vector4(0, -1, 1, 1),
      new Vector4(0, 1, -1, 1),
      new Vector4(0, -1, -1, 1),
      new Vector4(1, 0, 1, -1),
      new Vector4(-1, 0, 1, -1),
      new Vector4(1, 0, -1, -1),
      new Vector4(-1, 0, -1, -1),
      new Vector4(0, 1, 1, -1),
      new Vector4(0, -1, 1, -1),
      new Vector4(0, 1, -1, -1),
      new Vector4(0, -1, -1, -1),
    ];

    var perm: number[] = new Array(512);
    var gradP: Vector4[] = new Array(512);

    if (!seed) seed = 1;
    seed *= 65536;

    seed = Math.floor(seed);
    if (seed < 256) {
      seed |= seed << 8;
    }

    for (let i = 0; i < 256; i++) {
      let v: number;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed >> 8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = _gradientVecs[v % 28];
    }

    this._seed = seed;

    this._offsetMatrix = [
      new Vector4(0, 0, 0, 0),
      new Vector4(0, 0, 0, 1),
      new Vector4(0, 0, 1, 0),
      new Vector4(0, 0, 1, 1),
      new Vector4(0, 1, 0, 0),
      new Vector4(0, 1, 0, 1),
      new Vector4(0, 1, 1, 0),
      new Vector4(0, 1, 1, 1),
      new Vector4(1, 0, 0, 0),
      new Vector4(1, 0, 0, 1),
      new Vector4(1, 0, 1, 0),
      new Vector4(1, 0, 1, 1),
      new Vector4(1, 1, 0, 0),
      new Vector4(1, 1, 0, 1),
      new Vector4(1, 1, 1, 0),
      new Vector4(1, 1, 1, 1),
    ];

    this.perm = perm;
    this.gradP = gradP;
  }

  _fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  _lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }

  _gradient(posInCell: Vector) {
    if (posInCell instanceof Vector4)
      return (
        posInCell.x +
        this.perm[posInCell.y + this.perm[posInCell.z + this.perm[posInCell.w]]]
      );

    if (posInCell instanceof Vector3)
      return posInCell.x + this.perm[posInCell.y + this.perm[posInCell.z]];

    return posInCell.x + this.perm[posInCell.y];
  }

  /**
   * Maps a number from one range to another.
   */
  static map: MapType = (x, in_min, in_max, out_min, out_max) => {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  };

  /**
   * Samples 2D Perlin Nosie at given coordinates.
   */
  get2(input: Vector2): number {
    const cell = new Vector2(Math.floor(input.x), Math.floor(input.y));
    input.sub(cell);

    cell.x &= 255;
    cell.y &= 255;

    const gradiantDot: number[] = [];
    for (let i = 0; i < 4; i++) {
      const s4 = this._offsetMatrix[i * 4];
      const s = new Vector2(s4.x, s4.y);

      const grad4 =
        this.gradP[this._gradient(new Vector2().addVectors(cell, s))];
      const grad2 = new Vector2(grad4.x, grad4.y);
      const dist2 = new Vector2().subVectors(input, s);

      gradiantDot.push(grad2.dot(dist2));
    }

    const u = this._fade(input.x);
    const v = this._fade(input.y);

    const value = this._lerp(
      this._lerp(gradiantDot[0], gradiantDot[2], u),
      this._lerp(gradiantDot[1], gradiantDot[3], u),
      v
    );

    return value;
  }

  /**
   * Samples 3D Perlin Nosie at given coordinates.
   */
  get3(input: Vector3): number {
    if (input.z === undefined)
      throw "Input to Perlin::get3() must be of type Vector3";

    const cell = new Vector3(
      Math.floor(input.x),
      Math.floor(input.y),
      Math.floor(input.z)
    );
    input.sub(cell);

    cell.x &= 255;
    cell.y &= 255;
    cell.z &= 255;

    const gradiantDot: number[] = [];
    for (let i = 0; i < 8; i++) {
      const s4 = this._offsetMatrix[i * 2];
      const s = new Vector3(s4.x, s4.y, s4.z);

      const grad4 =
        this.gradP[this._gradient(new Vector3().addVectors(cell, s))];
      const grad3 = new Vector3(grad4.x, grad4.y, grad4.z);
      const dist2 = new Vector3().subVectors(input, s);

      gradiantDot.push(grad3.dot(dist2));
    }

    const u = this._fade(input.x);
    const v = this._fade(input.y);
    const w = this._fade(input.z);

    const value = this._lerp(
      this._lerp(
        this._lerp(gradiantDot[0], gradiantDot[4], u),
        this._lerp(gradiantDot[1], gradiantDot[5], u),
        w
      ),
      this._lerp(
        this._lerp(gradiantDot[2], gradiantDot[6], u),
        this._lerp(gradiantDot[3], gradiantDot[7], u),
        w
      ),
      v
    );

    return value;
  }

  /**
   * Samples 4D Perlin Nosie at given coordinates.
   */
  get4(input: Vector4): number {
    if (input.z === undefined || input.w === undefined)
      throw "Input to Perlin::get3() must be of type Vector4";

    const cell = new Vector4(
      Math.floor(input.x),
      Math.floor(input.y),
      Math.floor(input.z),
      Math.floor(input.w)
    );
    input.sub(cell);

    cell.x &= 255;
    cell.y &= 255;
    cell.z &= 255;
    cell.w &= 255;

    const gradiantDot: number[] = [];
    for (let i = 0; i < 16; i++) {
      const s = this._offsetMatrix[i];

      const grad4 =
        this.gradP[this._gradient(new Vector4().addVectors(cell, s))];
      const dist2 = new Vector4().subVectors(input, s);

      gradiantDot.push(grad4.dot(dist2));
    }

    const u = this._fade(input.x);
    const v = this._fade(input.y);
    const w = this._fade(input.z);
    const t = this._fade(input.w);

    const value = this._lerp(
      this._lerp(
        this._lerp(
          this._lerp(gradiantDot[0], gradiantDot[8], u),
          this._lerp(gradiantDot[1], gradiantDot[9], u),
          t
        ),
        this._lerp(
          this._lerp(gradiantDot[2], gradiantDot[10], u),
          this._lerp(gradiantDot[3], gradiantDot[11], u),
          t
        ),
        w
      ),
      this._lerp(
        this._lerp(
          this._lerp(gradiantDot[4], gradiantDot[12], u),
          this._lerp(gradiantDot[5], gradiantDot[13], u),
          t
        ),
        this._lerp(
          this._lerp(gradiantDot[6], gradiantDot[14], u),
          this._lerp(gradiantDot[7], gradiantDot[15], u),
          t
        ),
        w
      ),
      v
    );

    return value;
  }
}
