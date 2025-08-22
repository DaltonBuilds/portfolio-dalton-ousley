"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

type ElementLikeRef<T extends HTMLElement> = { current: T | null };

interface AnimatedBeamProps {
  className?: string;
  containerRef: ElementLikeRef<HTMLDivElement>; // Container ref
  fromRef: ElementLikeRef<HTMLDivElement>;
  toRef: ElementLikeRef<HTMLDivElement>;
  curvature?: number;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  duration = Math.random() * 3 + 4,
  delay = Math.random(),
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const gradientId = React.useId();

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const fromRect = fromRef.current.getBoundingClientRect();
        const toRect = toRef.current.getBoundingClientRect();

        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        // Compute centers
        const fromCenterX = fromRect.left - containerRect.left + fromRect.width / 2;
        const fromCenterY = fromRect.top - containerRect.top + fromRect.height / 2;
        const toCenterX = toRect.left - containerRect.left + toRect.width / 2;
        const toCenterY = toRect.top - containerRect.top + toRect.height / 2;

        const dx = toCenterX - fromCenterX;
        const dy = toCenterY - fromCenterY;
        const isMostlyHorizontal = Math.abs(dx) >= Math.abs(dy);

        // Anchor to nearest edges instead of centers
        let startX: number, startY: number, endX: number, endY: number;
        const EDGE_INSET = 6; // tuck slightly under card edge to avoid visible gap
        if (isMostlyHorizontal) {
          // From right/left edge towards target
          const fromEdgeX = dx >= 0
            ? fromRect.right - containerRect.left - EDGE_INSET
            : fromRect.left - containerRect.left + EDGE_INSET;
          const toEdgeX = dx >= 0
            ? toRect.left - containerRect.left + EDGE_INSET
            : toRect.right - containerRect.left - EDGE_INSET;
          startX = fromEdgeX + startXOffset;
          startY = fromCenterY + startYOffset;
          endX = toEdgeX + endXOffset;
          endY = toCenterY + endYOffset;
        } else {
          // From bottom/top edge towards target
          const fromEdgeY = dy >= 0
            ? fromRect.bottom - containerRect.top - EDGE_INSET
            : fromRect.top - containerRect.top + EDGE_INSET;
          const toEdgeY = dy >= 0
            ? toRect.top - containerRect.top + EDGE_INSET
            : toRect.bottom - containerRect.top - EDGE_INSET;
          startX = fromCenterX + startXOffset;
          startY = fromEdgeY + startYOffset;
          endX = toCenterX + endXOffset;
          endY = toEdgeY + endYOffset;
        }

        // Cubic Bézier control points for smoother paths
        const c1x = isMostlyHorizontal ? startX + dx * 0.33 : startX;
        const c1y = isMostlyHorizontal ? startY : startY + dy * 0.33;
        const c2x = isMostlyHorizontal ? startX + dx * 0.66 : endX;
        const c2y = isMostlyHorizontal ? endY : startY + dy * 0.66;

        const d = `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
        setPathD(d);
      }
    };

    const resizeObserver = new ResizeObserver(updatePath);
    const mutationObserver = new MutationObserver(updatePath);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      mutationObserver.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    }

    updatePath();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu -z-10",
        className
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <defs>
        <motion.linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "-200%", x2: "-200%", y1: "0%", y2: "0%" }}
          animate={{ x1: "200%", x2: "200%" }}
          transition={{
            delay,
            duration,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity={0}></stop>
          <stop stopColor={gradientStartColor}></stop>
          <stop offset="32.5%" stopColor={gradientStopColor}></stop>
          <stop
            offset="100%"
            stopColor={gradientStopColor}
            stopOpacity={0}
          ></stop>
        </motion.linearGradient>
      </defs>
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
      />
      <motion.path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
        strokeDasharray="6 14"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -40 }}
        transition={{ duration: duration * 1.2, ease: "linear", repeat: Infinity, delay }}
        opacity={0.35}
      />
    </svg>
  );
};
