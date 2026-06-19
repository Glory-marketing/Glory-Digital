"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface TextItem {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
}

let textIdCounter = 0;
function genId() {
  textIdCounter += 1;
  return `text_${textIdCounter}`;
}

export function DesignEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#FCF6BA");
  const [fontSize, setFontSize] = useState(24);
  const [bgColor, setBgColor] = useState("#1a1a1a");

  const dragging = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const item of texts) {
      const isSelected = item.id === selectedId;
      ctx.font = `${item.fontSize}px sans-serif`;
      ctx.textBaseline = "top";
      ctx.fillStyle = item.color;
      ctx.fillText(item.text, item.x, item.y);

      if (isSelected) {
        const metrics = ctx.measureText(item.text);
        ctx.strokeStyle = "#BF953F";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(
          item.x - 4,
          item.y - 4,
          metrics.width + 8,
          item.fontSize + 8
        );
        ctx.setLineDash([]);
      }
    }
  }, [texts, selectedId, bgColor]);

  useEffect(() => {
    draw();
  }, [draw]);

  const addText = () => {
    const input = prompt("Enter text:");
    if (!input || !input.trim()) return;
    const newItem: TextItem = {
      id: genId(),
      text: input.trim(),
      x: Math.floor(Math.random() * 280) + 20,
      y: Math.floor(Math.random() * 380) + 20,
      color: textColor,
      fontSize,
    };
    setTexts((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const clearCanvas = () => {
    setTexts([]);
    setSelectedId(null);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const getHitIndex = (cx: number, cy: number): string | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    for (let i = texts.length - 1; i >= 0; i--) {
      const item = texts[i];
      ctx.font = `${item.fontSize}px sans-serif`;
      const metrics = ctx.measureText(item.text);
      if (
        cx >= item.x &&
        cx <= item.x + metrics.width &&
        cy >= item.y &&
        cy <= item.y + item.fontSize
      ) {
        return item.id;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hitId = getHitIndex(x, y);
    if (hitId) {
      setSelectedId(hitId);
      const item = texts.find((t) => t.id === hitId);
      if (item) {
        dragging.current = { id: hitId, offsetX: x - item.x, offsetY: y - item.y };
      }
    } else {
      setSelectedId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTexts((prev) =>
      prev.map((item) =>
        item.id === dragging.current!.id
          ? {
              ...item,
              x: Math.max(0, x - dragging.current!.offsetX),
              y: Math.max(0, y - dragging.current!.offsetY),
            }
          : item
      )
    );
  };

  const handleMouseUp = () => {
    dragging.current = null;
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      <div
        className="overflow-hidden rounded-xl border-2 border-[#BF953F]/50 shadow-[0_0_20px_rgba(191,149,63,0.15)]"
        style={{ width: 400, height: 500 }}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          className="block h-full w-full cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="flex w-full max-w-[400px] flex-col gap-4 rounded-xl border border-white/10 bg-[#121212] p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={addText}
            className="rounded-lg bg-gradient-to-r from-[#BF953F] to-[#B38728] px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            + Add Text
          </button>
          <button
            onClick={clearCanvas}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-red-500/30 hover:text-red-400"
          >
            Clear
          </button>
          <button
            onClick={download}
            className="rounded-lg border border-[#BF953F]/30 px-4 py-2 text-sm text-[#BF953F] transition-colors hover:bg-[#BF953F]/10"
          >
            Download PNG
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-400">
            Color
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-400">
            Size
            <input
              type="range"
              min={12}
              max={72}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-24 accent-[#BF953F]"
            />
            <span className="w-6 text-center text-xs text-white">{fontSize}</span>
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-400">
            BG
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded border border-white/10 bg-transparent"
            />
          </label>
        </div>

        {selectedId && (
          <p className="text-xs text-gray-500">
            Selected text — drag to move on canvas
          </p>
        )}
      </div>
    </div>
  );
}
