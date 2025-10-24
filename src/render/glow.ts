export function applyGlow(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  // Placeholder glow implementation: subtle global alpha overlay.
  const { width, height } = canvas;
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) / 1.2);
  gradient.addColorStop(0, 'rgba(255,255,255,0.05)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
