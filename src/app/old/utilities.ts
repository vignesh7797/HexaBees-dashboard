function hexToHSL(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
  
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; 
    const l = (max + min) / 2;
  
    const d = max - min;
    if (d !== 0) {
      s = d / (1 - Math.abs(2 * l - 1));
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
        case g: h = ((b - r) / d + 2); break;
        case b: h = ((r - g) / d + 4); break;
      }
      h *= 60;
    }
  
    return { h, s: s * 100, l: l * 100 };
  }
  
function hslToHex(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
  
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  
    return `#${[f(0), f(8), f(4)].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }
  
 
export function generatePalette(baseColor: string, count = 10): string[] {
    const { h, s, l } = hexToHSL(baseColor);
    const palette: string[] = [];
  
    const step = 30 / count; // Adjust lightness step
  
    for (let i = 0; i < count; i++) {
      const lightness = Math.max(5, Math.min(95, l - 15 + step * i));
      palette.push(hslToHex(h, s, lightness));
    }
  
    return palette;
  }
  
export function formatDateForMySQL(dateStr: string) {
      // Input: '14-05-2025'
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month}-${day}`; // Output: '2025-05-14'
    }
