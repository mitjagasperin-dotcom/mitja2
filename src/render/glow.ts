export function applyGlow(ctx: CanvasRenderingContext2D, draw: () => void): void {
  const offscreen = document.createElement("canvas");
  offscreen.width = ctx.canvas.width;
  offscreen.height = ctx.canvas.height;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) {
    draw();
    return;
  }
  drawToContext(offCtx, draw);
  offCtx.globalCompositeOperation = "source-in";
  offCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
  offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.filter = "blur(4px)";
  ctx.drawImage(offscreen, 0, 0);
  ctx.restore();
}

function drawToContext(ctx: CanvasRenderingContext2D, draw: () => void): void {
  ctx.save();
  draw();
  ctx.restore();
}
