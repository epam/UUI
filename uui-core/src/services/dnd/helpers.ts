export function getSector(x: number, y: number) {
    const rads = Math.atan2(y, x); // (-PI, PI)
    const rotatedRads = rads + Math.PI * 2 + Math.PI / 2; // rotate to make positive and align with clock convention (top is the 0)
    const sector = Math.floor((rotatedRads / (Math.PI * 2)) * 8) % 8;
    return sector;
}
