import ReactECharts from "echarts-for-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTNSEEmbeddings } from "@/services/embeddings-service";
import type { TNSEEmbedding } from "@/services/embeddings-service";
import { DetailedApiError } from "@/services/api-utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ColorMode = "correctness" | "label" | "pred_label";

export function TNSEScatterChart() {
  const isMobile = useIsMobile();
  const [colorMode, setColorMode] = useState<ColorMode>("correctness");
  const chartRef = useRef<ReactECharts | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("disconnect") &&
        event.message?.includes("sensor is undefined")
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason || "");
      if (
        reason.includes("disconnect") &&
        reason.includes("sensor is undefined")
      ) {
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  const {
    data: embeddings,
    isLoading,
    error,
  } = useQuery<TNSEEmbedding[], DetailedApiError>({
    queryKey: ["tnse-embeddings"],
    queryFn: async () => {
      const result = await fetchTNSEEmbeddings();
      if (result instanceof DetailedApiError) {
        throw result;
      }
      return result;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Model Understanding of Text: 2D Semantic Space of Predictions
          </CardTitle>
          <CardDescription>Loading embedding data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center justify-center ${
              isMobile ? "h-[300px]" : "h-[500px]"
            }`}
          >
            <div className="text-muted-foreground text-sm sm:text-base">
              Loading...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Model Understanding of Text: 2D Semantic Space of Predictions
          </CardTitle>
          <CardDescription>Error loading chart data</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center justify-center ${
              isMobile ? "h-[300px]" : "h-[500px]"
            }`}
          >
            <div className="text-destructive text-sm sm:text-base px-4 text-center">
              {error instanceof Error ? error.message : "Failed to load data"}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!embeddings || embeddings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Model Understanding of Text: 2D Semantic Space of Predictions
          </CardTitle>
          <CardDescription>No embedding data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center justify-center ${
              isMobile ? "h-[300px]" : "h-[500px]"
            }`}
          >
            <div className="text-muted-foreground text-sm sm:text-base">
              No data to display
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const correctCount = embeddings.filter((e) => e.correct === "True").length;
  const incorrectCount = embeddings.filter((e) => e.correct === "False").length;

  const dataByMode: Record<string, Array<[number, number, TNSEEmbedding]>> = {};

  embeddings.forEach((embedding) => {
    let key: string;
    if (colorMode === "correctness") {
      key = embedding.correct;
    } else if (colorMode === "label") {
      key = `Label: ${embedding.label}`;
    } else {
      key = `Pred: ${embedding.pred_label}`;
    }

    if (!dataByMode[key]) {
      dataByMode[key] = [];
    }
    dataByMode[key].push([embedding.tnse_x, embedding.tnse_y, embedding]);
  });

  const series = Object.entries(dataByMode).map(([name, data]) => {
    let color: string;
    if (colorMode === "correctness") {
      color = name === "True" ? "#26a269" : "#ed333b";
    } else if (colorMode === "label") {
      color = name === "Label: 0" ? "#3584e4" : "#c061cb";
    } else {
      color = name === "Pred: 0" ? "#3584e4" : "#c061cb";
    }

    return {
      name,
      type: "scatter",
      data: data.map(([x, y, embedding]) => ({
        value: [x, y],
        embedding,
      })),
      symbolSize: isMobile ? 4 : 5,
      large: true,
      largeThreshold: 500,
      itemStyle: {
        color,
        opacity: 0.6,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 0.5,
      },
      emphasis: {
        itemStyle: {
          opacity: 1,
          borderColor: "#fff",
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        scale: true,
      },
    };
  });

  const chartOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const embedding = params.data.embedding as TNSEEmbedding;
        const correctColor =
          embedding.correct === "True" ? "#26a269" : "#ed333b";
        return `
          <div style="padding: 10px; line-height: 1.6;">
            <div style="font-weight: bold; margin-bottom: 6px; font-size: 14px;">ID: ${
              embedding.id
            }</div>
            <div><strong>True Label:</strong> ${embedding.label}</div>
            <div><strong>Predicted:</strong> ${embedding.pred_label}</div>
            <div style="color: ${correctColor};"><strong>Correct:</strong> ${
          embedding.correct
        }</div>
            <div style="margin-top: 6px; font-size: 11px; color: #999;">(${embedding.tnse_x.toFixed(
              2
            )}, ${embedding.tnse_y.toFixed(2)})</div>
          </div>
        `;
      },
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      borderColor: "rgba(255, 255, 255, 0.3)",
      borderWidth: 1,
      textStyle: {
        fontSize: isMobile ? 12 : 13,
        color: "#fff",
      },
      padding: [8, 12],
    },
    legend: {
      data: Object.keys(dataByMode),
      orient: isMobile ? "horizontal" : "vertical",
      left: isMobile ? "center" : "left",
      top: isMobile ? "top" : "middle",
      bottom: isMobile ? "auto" : "auto",
      textStyle: {
        fontSize: isMobile ? 11 : 13,
      },
      itemGap: isMobile ? 15 : 10,
    },
    grid: {
      left: isMobile ? "10%" : "15%",
      right: isMobile ? "10%" : "10%",
      top: isMobile ? "20%" : "15%",
      bottom: isMobile ? "20%" : "10%",
      containLabel: true,
    },
    xAxis: {
      type: "value",
      name: "t-SNE X",
      nameLocation: "middle",
      nameGap: 30,
      nameTextStyle: {
        fontSize: isMobile ? 12 : 14,
      },
      axisLabel: {
        fontSize: isMobile ? 10 : 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(128, 128, 128, 0.2)",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "t-SNE Y",
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontSize: isMobile ? 12 : 14,
      },
      axisLabel: {
        fontSize: isMobile ? 10 : 12,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(128, 128, 128, 0.15)",
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "inside",
        yAxisIndex: 0,
        filterMode: "none",
      },
      {
        type: "slider",
        xAxisIndex: 0,
        show: !isMobile,
        height: 20,
        bottom: 10,
        filterMode: "none",
      },
      {
        type: "slider",
        yAxisIndex: 0,
        show: !isMobile,
        width: 20,
        right: 10,
        filterMode: "none",
      },
    ],
    toolbox: {
      show: !isMobile,
      right: 10,
      top: 10,
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
        restore: {},
        saveAsImage: {},
      },
      iconStyle: {
        borderColor: "#666",
      },
    },
    series,
    animation: true,
    animationDuration: 800,
    animationEasing: "cubicOut",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Model Understanding of Text: 2D Semantic Space of Predictions
        </CardTitle>
        <CardDescription>
          {embeddings.length} data points • {correctCount} correct,{" "}
          {incorrectCount} incorrect predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={colorMode}
            onValueChange={(value) => {
              if (value) setColorMode(value as ColorMode);
            }}
            variant="outline"
            size="sm"
            spacing={0}
          >
            <ToggleGroupItem value="correctness" aria-label="By Correctness">
              By Correctness
            </ToggleGroupItem>
            <ToggleGroupItem value="label" aria-label="By True Label">
              By True Label
            </ToggleGroupItem>
            <ToggleGroupItem value="pred_label" aria-label="By Predicted Label">
              By Predicted Label
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <ReactECharts
          ref={(e) => {
            chartRef.current = e;
          }}
          option={chartOption}
          style={{ height: isMobile ? "400px" : "600px", width: "100%" }}
          opts={{ renderer: "canvas" }}
          notMerge={true}
          lazyUpdate={true}
          autoResize={false}
        />
      </CardContent>
    </Card>
  );
}
