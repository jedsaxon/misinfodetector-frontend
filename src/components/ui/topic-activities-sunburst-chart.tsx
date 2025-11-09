import ReactECharts from "echarts-for-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchTopicActivities } from "@/services/topic-activities-service";
import type { TopicActivity } from "@/services/topic-activities-service";
import { DetailedApiError } from "@/services/api-utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function TopicActivitiesSunburstChart() {
  const isMobile = useIsMobile();
  const chartRef = useRef<ReactECharts | null>(null);

  const {
    data: topicActivities,
    isLoading,
    error,
  } = useQuery<TopicActivity[], DetailedApiError>({
    queryKey: ["topic-activities"],
    queryFn: async () => {
      const result = await fetchTopicActivities();
      if (result instanceof DetailedApiError) {
        throw result;
      }
      return result;
    },
  });

  const sunburstData = useMemo(() => {
    if (!topicActivities || topicActivities.length === 0) {
      return [];
    }

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Filter to only 2016 and 2017
    const filtered = topicActivities.filter((a) => {
      const year = a.date.slice(0, 4);
      return year === "2016" || year === "2017";
    });

    if (filtered.length === 0) {
      return [];
    }

    const years = new Map<string, Map<string, Map<string, number>>>();

    filtered.forEach((a) => {
      const year = a.date.slice(0, 4);
      const month = monthNames[parseInt(a.date.slice(5, 7)) - 1];
      const topic = a.topic_name;

      if (!years.has(year)) years.set(year, new Map());
      const months = years.get(year)!;

      if (!months.has(month)) months.set(month, new Map());
      const topics = months.get(month)!;

      topics.set(topic, (topics.get(topic) ?? 0) + 1);
    });

    // Build sunburst data with all months pre-seeded
    const sunburstData = Array.from(years, ([year, months]) => ({
      name: year,
      children: monthNames.map((m) => ({
        name: m,
        children: months.has(m)
          ? Array.from(months.get(m)!, ([topic, count]) => ({
              name: topic,
              value: count,
            }))
          : [],
      })),
    }));

    return sunburstData;
  }, [topicActivities]);

  const option = useMemo(() => {
    if (!sunburstData || sunburstData.length === 0) {
      return {};
    }

    return {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          if (params.value) {
            return `${params.name}<br/>Count: ${params.value}`;
          }
          return params.name;
        },
        textStyle: {
          fontSize: isMobile ? 12 : 14,
        },
      },
      series: {
        type: "sunburst",
        data: sunburstData,
        radius: [0, "95%"],
        sort: null,
        label: { rotate: "radial", minAngle: 6 },
        levels: [
          {},
          { r0: "0%", r: "30%", label: { rotate: 0 } }, // Year ring
          { r0: "30%", r: "60%" }, // Month ring
          { r0: "60%", r: "95%", label: { show: false } }, // Topic ring
        ],
      },
    };
  }, [sunburstData, isMobile]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic Activities</CardTitle>
          <CardDescription>Loading chart data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center justify-center ${
              isMobile ? "h-[300px]" : "h-[400px]"
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
          <CardTitle>Topic Activities</CardTitle>
          <CardDescription>Error loading chart data</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center justify-center ${
              isMobile ? "h-[300px]" : "h-[400px]"
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

  if (!sunburstData || sunburstData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Topic Activities</CardTitle>
          <CardDescription>No topic activities available</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex items-center justify-center ${
              isMobile ? "h-[300px]" : "h-[400px]"
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

  // Count only filtered activities (2016-2017)
  const totalActivities = useMemo(() => {
    if (!topicActivities || topicActivities.length === 0) {
      return 0;
    }
    return topicActivities.filter((a) => {
      const year = a.date.slice(0, 4);
      return year === "2016" || year === "2017";
    }).length;
  }, [topicActivities]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Activities</CardTitle>
        <CardDescription>
          Topic activities by year and month (2016-2017) ({totalActivities}{" "}
          total activities)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-2">
        <ReactECharts
          ref={(e) => {
            chartRef.current = e;
          }}
          option={option}
          style={{ height: isMobile ? "300px" : "400px", width: "100%" }}
          opts={{ renderer: "svg" }}
          autoResize={false}
        />
      </CardContent>
    </Card>
  );
}
