"use client";

import * as React from "react";
import cytoscape from "cytoscape";
import { GraphNode, GraphEdge } from "@/constants/mockNetworkData";
import { tokens } from "@/styles/tokens";

interface NetworkGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onNodeSelect: (node: GraphNode) => void;
}

export default function NetworkGraph({ nodes, edges, onNodeSelect }: NetworkGraphProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cyRef = React.useRef<cytoscape.Core | null>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // Map React nodes/edges to Cytoscape elements
    const cyElements = [
      ...nodes.map((n) => ({
        data: {
          id: n.id,
          label: n.label,
          type: n.type,
          risk: n.riskScore,
        },
      })),
      ...edges.map((e) => ({
        data: {
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.type,
        },
      })),
    ];

    // Initialize Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: cyElements,
      style: [
        // Default Node styling
        {
          selector: "node",
          style: {
            "label": "data(label)",
            "color": "#F9FAFB",
            "font-size": 9,
            "font-family": "Inter, sans-serif",
            "font-weight": "bold",
            "text-valign": "bottom",
            "text-margin-y": 6,
            "border-width": 2,
            "border-color": "#1F2937",
            "width": 36,
            "height": 36,
            "overlay-padding": 6,
            "overlay-opacity": 0,
          },
        },
        // Types styling overrides
        {
          selector: 'node[type="Suspect"]',
          style: { "background-color": "#EF4444", "shape": "ellipse" },
        },
        {
          selector: 'node[type="Case"]',
          style: { "background-color": "#F97316", "shape": "rectangle" },
        },
        {
          selector: 'node[type="Victim"]',
          style: { "background-color": "#10B981", "shape": "ellipse" },
        },
        {
          selector: 'node[type="Gang"]',
          style: { "background-color": "#991B1B", "shape": "hexagon", "width": 46, "height": 46 },
        },
        {
          selector: 'node[type="Vehicle"]',
          style: { "background-color": "#F59E0B", "shape": "diamond" },
        },
        {
          selector: 'node[type="Weapon"]',
          style: { "background-color": "#8B5CF6", "shape": "triangle" },
        },
        {
          selector: 'node[type="Mobile Number"]',
          style: { "background-color": "#06B6D4", "shape": "ellipse" },
        },
        {
          selector: 'node[type="Crime Scene"]',
          style: { "background-color": "#4B5563", "shape": "octagon" },
        },
        {
          selector: 'node[type="Investigation Officer"]',
          style: { "background-color": "#EC4899", "shape": "ellipse" },
        },
        {
          selector: 'node[type="Police Station"]',
          style: { "background-color": "#2563EB", "shape": "round-rectangle" },
        },
        {
          selector: 'node[type="District"]',
          style: { "background-color": "#8B5CF6", "shape": "hexagon", "width": 50, "height": 50 },
        },
        // Default Edge styling
        {
          selector: "edge",
          style: {
            "width": 1.5,
            "line-color": "#4B5563",
            "target-arrow-color": "#4B5563",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "label": "data(label)",
            "font-size": 7,
            "color": "#9CA3AF",
            "text-rotation": "autorotate",
            "text-margin-y": -6,
            "arrow-scale": 0.8,
          },
        },
        // Associated specific Edge overrides
        {
          selector: 'edge[label="Associated With"]',
          style: {
            "line-style": "dashed",
            "line-color": "#3B82F6",
            "target-arrow-color": "#3B82F6",
          },
        },
      ],
      layout: {
        name: "cose",
        animate: false,
        fit: true,
        padding: 30,
      } as any,
    });

    cyRef.current = cy;

    // Attach click listeners to bubble nodes up
    cy.on("tap", "node", (evt) => {
      const nodeData = evt.target.data();
      const matched = nodes.find((n) => n.id === nodeData.id);
      if (matched) {
        onNodeSelect(matched);
      }
    });

    // Cleanup on unmount to prevent memory leaks
    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
      }
    };
  }, [nodes, edges, onNodeSelect]);

  return (
    <div className="h-full w-full bg-[#0B0F19] rounded-lg border border-border-subtle relative overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
