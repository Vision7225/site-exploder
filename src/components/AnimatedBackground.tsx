import { useEffect, useRef } from "react";

export type AnimVariant =
  | "neurons"
  | "brainwaves"
  | "ripples"
  | "particles"
  | "waveform"
  | "filmstrip"
  | "letters"
  | "feathers"
  | "stars"
  | "dna";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  speed: number;
  char?: string;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createNodes(count: number, w: number, h: number, variant: AnimVariant): Node[] {
  return Array.from({ length: count }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    vx: rand(-0.3, 0.3) * (variant === "stars" ? 0.3 : 1),
    vy: rand(-0.3, 0.3) * (variant === "stars" ? 0.3 : 1),
    r: rand(2, 5),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.005, 0.02),
    char: variant === "letters" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(rand(0, 62))] : undefined,
  }));
}

const COLORS: Record<AnimVariant, { node: string; line: string; glow: string }> = {
  neurons:   { node: "rgba(59,130,246,0.5)",  line: "rgba(59,130,246,0.12)",  glow: "rgba(59,130,246,0.25)" },
  brainwaves:{ node: "rgba(139,92,246,0.45)", line: "rgba(139,92,246,0.1)",   glow: "rgba(139,92,246,0.2)" },
  ripples:   { node: "rgba(14,165,233,0.4)",  line: "rgba(14,165,233,0.08)",  glow: "rgba(14,165,233,0.2)" },
  particles: { node: "rgba(34,197,94,0.4)",   line: "rgba(34,197,94,0.08)",   glow: "rgba(34,197,94,0.15)" },
  waveform:  { node: "rgba(245,158,11,0.4)",  line: "rgba(245,158,11,0.1)",   glow: "rgba(245,158,11,0.2)" },
  filmstrip: { node: "rgba(239,68,68,0.35)",  line: "rgba(239,68,68,0.08)",   glow: "rgba(239,68,68,0.15)" },
  letters:   { node: "rgba(14,165,233,0.3)",  line: "rgba(14,165,233,0.06)",  glow: "rgba(14,165,233,0.15)" },
  feathers:  { node: "rgba(168,85,247,0.35)", line: "rgba(168,85,247,0.08)",  glow: "rgba(168,85,247,0.15)" },
  stars:     { node: "rgba(99,102,241,0.3)",  line: "rgba(99,102,241,0.06)",  glow: "rgba(99,102,241,0.12)" },
  dna:       { node: "rgba(59,130,246,0.4)",  line: "rgba(59,130,246,0.1)",   glow: "rgba(59,130,246,0.2)" },
};

function drawNeurons(ctx: CanvasRenderingContext2D, nodes: Node[], w: number, h: number, t: number, colors: typeof COLORS.neurons) {
  const connectionDist = 140;
  // draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectionDist) {
        const alpha = (1 - dist / connectionDist) * 0.4;
        ctx.strokeStyle = colors.line.replace("0.12", String(alpha));
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  // draw nodes with pulse
  nodes.forEach((n) => {
    const pulse = 1 + 0.3 * Math.sin(t * 2 + n.phase);
    const r = n.r * pulse;
    // glow
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
    grad.addColorStop(0, colors.glow);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
    ctx.fill();
    // core
    ctx.fillStyle = colors.node;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBrainwaves(ctx: CanvasRenderingContext2D, _nodes: Node[], w: number, h: number, t: number, colors: typeof COLORS.neurons) {
  const waves = 5;
  for (let i = 0; i < waves; i++) {
    const yBase = h * 0.2 + (h * 0.6 / waves) * i;
    const freq = 0.008 + i * 0.003;
    const amp = 20 + i * 8;
    ctx.strokeStyle = colors.node.replace("0.45", String(0.15 + i * 0.06));
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const y = yBase + Math.sin(x * freq + t * (1 + i * 0.3) + i) * amp + Math.sin(x * freq * 2.5 + t * 1.5) * amp * 0.3;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  // floating particles along waves
  _nodes.slice(0, 15).forEach((n) => {
    const pulse = 0.5 + 0.5 * Math.sin(t * 3 + n.phase);
    ctx.fillStyle = colors.glow.replace("0.2", String(0.1 + pulse * 0.2));
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r * 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawRipples(ctx: CanvasRenderingContext2D, nodes: Node[], w: number, h: number, t: number, colors: typeof COLORS.neurons) {
  // concentric ripples from node positions
  nodes.slice(0, 8).forEach((n) => {
    for (let r = 0; r < 3; r++) {
      const radius = ((t * 30 + r * 50 + n.phase * 30) % 180);
      const alpha = Math.max(0, 0.25 - radius / 180 * 0.25);
      ctx.strokeStyle = colors.node.replace("0.4", String(alpha));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    // center dot
    ctx.fillStyle = colors.glow;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawWaveform(ctx: CanvasRenderingContext2D, _nodes: Node[], w: number, h: number, t: number, colors: typeof COLORS.neurons) {
  // vertical bars like an audio waveform
  const barW = 4;
  const gap = 6;
  const total = Math.floor(w / (barW + gap));
  const cy = h / 2;
  for (let i = 0; i < total; i++) {
    const x = i * (barW + gap);
    const amp = 30 + 50 * Math.abs(Math.sin(i * 0.15 + t * 1.5)) * Math.abs(Math.cos(i * 0.08 + t * 0.7));
    const alpha = 0.1 + 0.15 * Math.abs(Math.sin(i * 0.1 + t));
    ctx.fillStyle = colors.node.replace("0.4", String(alpha));
    ctx.beginPath();
    ctx.roundRect(x, cy - amp, barW, amp * 2, 2);
    ctx.fill();
  }
}

function drawStars(ctx: CanvasRenderingContext2D, nodes: Node[], _w: number, _h: number, t: number, colors: typeof COLORS.neurons) {
  nodes.forEach((n) => {
    const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(t * n.speed * 60 + n.phase));
    const r = n.r * twinkle;
    // soft glow
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 5);
    grad.addColorStop(0, colors.glow.replace("0.12", String(0.08 * twinkle)));
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(n.x, n.y, r * 5, 0, Math.PI * 2);
    ctx.fill();
    // dot
    ctx.fillStyle = colors.node.replace("0.3", String(0.15 + twinkle * 0.25));
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawLetters(ctx: CanvasRenderingContext2D, nodes: Node[], _w: number, _h: number, t: number, colors: typeof COLORS.neurons) {
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  nodes.forEach((n) => {
    const alpha = 0.08 + 0.12 * Math.abs(Math.sin(t * 2 + n.phase));
    ctx.fillStyle = colors.node.replace("0.3", String(alpha));
    ctx.fillText(n.char || "A", n.x, n.y);
  });
}

function drawDNA(ctx: CanvasRenderingContext2D, _nodes: Node[], w: number, h: number, t: number, colors: typeof COLORS.neurons) {
  const cx = w / 2;
  const amp = 80;
  const step = 12;
  for (let y = -20; y < h + 20; y += step) {
    const offset = Math.sin(y * 0.02 + t * 1.2) * amp;
    const x1 = cx + offset;
    const x2 = cx - offset;
    const alpha = 0.12 + 0.08 * Math.abs(Math.sin(y * 0.03 + t));
    // connectors
    ctx.strokeStyle = colors.line.replace("0.1", String(alpha * 0.5));
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    // nodes
    [x1, x2].forEach((x) => {
      ctx.fillStyle = colors.node.replace("0.4", String(alpha));
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

function drawDefault(ctx: CanvasRenderingContext2D, nodes: Node[], w: number, h: number, t: number, colors: typeof COLORS.neurons) {
  nodes.forEach((n) => {
    const float = Math.sin(t + n.phase) * 8;
    const alpha = 0.06 + 0.08 * Math.abs(Math.sin(t * 1.5 + n.phase));
    ctx.fillStyle = colors.node.replace(/[\d.]+\)$/, `${alpha})`);
    ctx.beginPath();
    ctx.arc(n.x, n.y + float, n.r * 1.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

const DRAW_FN: Record<AnimVariant, typeof drawNeurons> = {
  neurons: drawNeurons,
  brainwaves: drawBrainwaves,
  ripples: drawRipples,
  particles: drawDefault,
  waveform: drawWaveform,
  filmstrip: drawDefault,
  letters: drawLetters,
  feathers: drawDefault,
  stars: drawStars,
  dna: drawDNA,
};

const NODE_COUNT: Record<AnimVariant, number> = {
  neurons: 45,
  brainwaves: 20,
  ripples: 8,
  particles: 40,
  waveform: 0,
  filmstrip: 30,
  letters: 50,
  feathers: 25,
  stars: 60,
  dna: 0,
};

export default function AnimatedBackground({ variant = "neurons" }: { variant?: AnimVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let nodes: Node[] = [];
    let w = 0, h = 0;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = canvas!.parentElement?.clientWidth || window.innerWidth;
      h = canvas!.parentElement?.clientHeight || window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = createNodes(NODE_COUNT[variant], w, h, variant);
    }

    resize();
    window.addEventListener("resize", resize);

    let startTime = performance.now();

    function animate(now: number) {
      const t = (now - startTime) / 1000;
      ctx!.clearRect(0, 0, w, h);

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        // wrap
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;
      });

      const colors = COLORS[variant];
      const drawFn = DRAW_FN[variant] || drawDefault;
      drawFn(ctx!, nodes, w, h, t, colors);

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
