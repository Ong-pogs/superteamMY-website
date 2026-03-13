"use client";

import { useMemo, useEffect } from "react";
import * as THREE from "three";

interface PartnerInfo {
  name: string;
  category: string;
}

const PARTNERS: PartnerInfo[] = [
  { name: "Solana Foundation", category: "Ecosystem" },
  { name: "Jupiter", category: "DeFi" },
  { name: "Tensor", category: "NFT" },
  { name: "Marinade", category: "DeFi" },
  { name: "Helius", category: "Infrastructure" },
  { name: "Phantom", category: "Wallet" },
  { name: "Jito", category: "DeFi" },
  { name: "Squads", category: "Infrastructure" },
];

const COLOR_ROTATION = [
  "#00FFA3", // green
  "#9945FF", // purple
  "#14F195", // blue
  "#FFB800", // gold
  "#00FFA3",
  "#9945FF",
  "#14F195",
  "#FFB800",
];

function createScreenTexture(
  name: string,
  category: string,
  color: string,
  width: number,
  height: number
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  // Dark background
  ctx.fillStyle = "#0a1a0a";
  ctx.fillRect(0, 0, width, height);

  // Scanline pattern
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 2);
  }

  // Partner name — centered
  const fontSize = Math.min(width / (name.length * 0.65), height * 0.18);
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillText(name, width / 2, height * 0.42);
  // Second pass for stronger glow
  ctx.shadowBlur = 8;
  ctx.fillText(name, width / 2, height * 0.42);
  ctx.shadowBlur = 0;

  // Category label below
  ctx.font = `${Math.floor(fontSize * 0.45)}px monospace`;
  ctx.fillStyle = "rgba(136,136,160,0.5)";
  ctx.fillText(`[${category}]`, width / 2, height * 0.62);

  // Radial vignette overlay
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.15,
    width / 2,
    height / 2,
    width * 0.6
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function useMonitorTextures() {
  const textures = useMemo(() => {
    return PARTNERS.map((p, i) =>
      createScreenTexture(p.name, p.category, COLOR_ROTATION[i], 512, 384)
    );
  }, []);

  useEffect(() => {
    return () => {
      textures.forEach((t) => t.dispose());
    };
  }, [textures]);

  return { textures, colors: COLOR_ROTATION, partners: PARTNERS };
}
