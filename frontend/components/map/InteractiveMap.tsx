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

export default function InteractiveMap({
  districtRisks,
  hotspots,
  layerControls,
  onSelectDistrict,
  onSelectStation,
}: InteractiveMapProps) {
  // Center of Karnataka
  const centerPosition: [number, number] = [14.8, 75.8];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-border-subtle bg-[#0B0F19]">
      <MapContainer
        center={centerPosition}
        zoom={7}
        className="h-full w-full"
        zoomControl={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Dark theme maps tile provider */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
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
          mockStations.map((station) => {
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
