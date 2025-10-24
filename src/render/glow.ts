export interface GlowBuffers {
  offscreen: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export function ensureGlowCanvas(base: HTMLCanvasElement): GlowBuffers | null {
  if (!("transferControlToOffscreen" in base)) {
    const offscreen = document.createElement("canvas");
    offscreen.width = base.width;
    offscreen.height = base.height;
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      return null;
    }
    ctx.filter = "blur(6px)";
    return { offscreen, ctx };
  }
  return null;
}

export function compositeGlow(
  glow: GlowBuffers | null,
  baseCtx: CanvasRenderingContext2D,
  drawGlowContent: (ctx: CanvasRenderingContext2D) => void
): void {
  if (!glow) {
    drawGlowContent(baseCtx);
    return;
  }
  const { offscreen, ctx } = glow;
  ctx.save();
  ctx.clearRect(0, 0, offscreen.width, offscreen.height);
  drawGlowContent(ctx);
  ctx.restore();
  baseCtx.save();
  baseCtx.globalCompositeOperation = "lighter";
  baseCtx.globalAlpha = 0.1;
  baseCtx.drawImage(offscreen, 0, 0);
  baseCtx.restore();
}
