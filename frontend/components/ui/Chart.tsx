"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Spinner } from "./Feedback";

// Dynamic import with SSR disabled to prevent server-side rendering crashes
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center bg-background-card rounded-lg">
      <Spinner size="md" />
    </div>
  ),
});

interface ChartProps {
  option: any;
  className?: string;
  style?: React.CSSProperties;
}

export default function Chart({ option, className, style }: ChartProps) {
  return (
    <div className={className} style={{ width: "100%", ...style }}>
      <ReactECharts
        option={option}
        style={{ height: "100%", width: "100%" }}
        opts={{ renderer: "svg" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
