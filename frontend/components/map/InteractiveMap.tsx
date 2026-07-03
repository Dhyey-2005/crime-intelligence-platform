"use client";

import * as React from "react";
import { MapContainer, TileLayer, Polygon, Circle, CircleMarker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { districtsGeoJSON, mockStations, HotspotPoint, StationMarker } from "@/constants/mockGeographicData";
import { tokens } from "@/styles/tokens";

// Fix Leaflet container size bugs in absolute wrappers
interface InteractiveMapProps {
  districtRisks: Record<string, "High" | "Elevated" | "Moderate" | "Low">;
  hotspots: HotspotPoint[];
  stations?: StationMarker[];
  layerControls: {
    districts: boolean;
    stations: boolean;
    hotspots: boolean;
    resources: boolean;
    alerts: boolean;
  };
  onSelectDistrict: (name: string) => void;
  onSelectStation: (station: StationMarker) => void;
}

const getRiskColor = (risk: "High" | "Elevated" | "Moderate" | "Low") => {
  switch (risk) {
    case "High":
      return { fill: tokens.colors.danger, border: "#DC2626" };
    case "Elevated":
      return { fill: tokens.colors.warning, border: "#EA580C" };
    case "Moderate":
      return { fill: "#FBBF24", border: "#D97706" };
    case "Low":
      return { fill: tokens.colors.success, border: "#16A34A" };
    default:
      return { fill: tokens.colors.border.default, border: tokens.colors.border.subtle };
  }
};

// Outer geographical boundary contour of Karnataka State
const karnatakaStateOutline: [number, number][] = [
  [18.06, 77.4],
  [17.65, 77.35],
  [17.3, 76.8],
  [16.8, 75.8],
  [15.8, 74.3],
  [14.9, 74.05],
  [14.0, 74.5],
  [12.8, 74.8],
  [12.1, 75.4],
  [11.75, 76.1],
  [11.9, 76.9],
  [12.5, 77.8],
  [13.1, 78.5],
  [13.8, 78.4],
  [14.3, 78.0],
  [15.1, 77.8],
  [16.2, 77.4],
  [17.2, 77.5],
];

export default function InteractiveMap({
  districtRisks,
  hotspots,
  stations,
  layerControls,
  onSelectDistrict,
  onSelectStation,
}: InteractiveMapProps) {
  // Center of Karnataka
  const centerPosition: [number, number] = [14.8, 75.8];
  const stationList = stations || mockStations;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border-subtle bg-[#0B0F19]">
      <MapContainer
        center={centerPosition}
        zoom={7}
        minZoom={7}
        maxZoom={15}
        maxBounds={[[11.0, 73.5], [19.0, 79.0]]}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
        zoomControl={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Dark theme maps tile provider */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* State Boundary Outline Layer (Karnataka Only Highlight) */}
        <Polygon
          positions={karnatakaStateOutline}
          pathOptions={{
            fillColor: "#3b82f6",
            fillOpacity: 0.04,
            color: "#3b82f6",
            weight: 2,
            dashArray: "6, 6",
          }}
          interactive={false}
        />

        {/* 1. Districts Boundaries Layer */}
        {layerControls.districts &&
          districtsGeoJSON.map((dist) => {
            const risk = districtRisks[dist.name] || "Low";
            const colors = getRiskColor(risk);

            return (
              <Polygon
                key={dist.name}
                positions={dist.coordinates}
                pathOptions={{
                  fillColor: colors.fill,
                  fillOpacity: 0.18,
                  color: colors.border,
                  weight: 1.5,
                  dashArray: "3",
                }}
                eventHandlers={{
                  click: () => onSelectDistrict(dist.name),
                }}
              >
                <Tooltip sticky>
                  <span className="text-[10px] font-semibold text-[#0B0F19]">
                    {dist.name} ({risk} Risk)
                  </span>
                </Tooltip>
              </Polygon>
            );
          })}

        {/* 2. Hotspots Layer */}
        {layerControls.hotspots &&
          hotspots.map((hs, index) => (
            <Circle
              key={`hs-${index}`}
              center={[hs.lat, hs.lng]}
              radius={hs.radius}
              pathOptions={{
                fillColor: "#EF4444",
                fillOpacity: hs.intensity * 0.35,
                color: "transparent",
              }}
            />
          ))}

        {/* 3. Police Stations Marker Layer */}
        {layerControls.stations &&
          stationList.map((station) => {
            const isHighRisk = station.riskScore > 70;
            const markerColor = isHighRisk ? tokens.colors.danger : station.riskScore > 50 ? tokens.colors.warning : tokens.colors.success;

            return (
              <CircleMarker
                key={station.id}
                center={[station.lat, station.lng]}
                radius={6}
                pathOptions={{
                  fillColor: markerColor,
                  fillOpacity: 0.8,
                  color: "#FFFFFF",
                  weight: 1,
                }}
                eventHandlers={{
                  click: () => onSelectStation(station),
                }}
              >
                <Popup>
                  <div className="text-[10px] text-[#0B0F19] leading-snug font-sans max-w-[150px]">
                    <span className="font-bold text-xs block mb-1 border-b border-gray-200 pb-0.5">{station.name}</span>
                    <span className="block">District: <strong className="font-semibold">{station.district}</strong></span>
                    <span className="block">Total FIRs: <strong className="font-semibold">{station.totalFIRs}</strong></span>
                    <span className="block">Active Cases: <strong className="font-semibold">{station.activeCases}</strong></span>
                    <span className="block">Pending Search: <strong className="font-semibold">{station.pendingInvestigations}</strong></span>
                    <span className="block mt-1 font-semibold text-red-600">Risk Score: {station.riskScore}%</span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
