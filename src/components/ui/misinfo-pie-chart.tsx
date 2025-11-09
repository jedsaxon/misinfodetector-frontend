import ReactECharts from "echarts-for-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchPosts, Post, PostResponse } from "@/services/posts-service";
import { DetailedApiError } from "@/services/api-utils";
import { useIsMobile } from "@/hooks/use-mobile";

export function MisinfoPieChart() {
  const isMobile = useIsMobile();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });

  // First, fetch page 1 to get the total page count
  const {
    data: firstPage,
    isLoading: isLoadingFirst,
    error,
  } = useQuery<PostResponse, DetailedApiError>({
    queryKey: ["posts", 1, 50],
    queryFn: async () => {
      const result = await fetchPosts(1, 50);
      if (result instanceof DetailedApiError) {
        throw result;
      }
      return result;
    },
  });

  // Fetch all remaining pages sequentially
  useEffect(() => {
    if (!firstPage) return;

    const totalPages = firstPage.pageCount;
    if (totalPages <= 1) {
      setAllPosts(firstPage.posts);
      return;
    }

    setIsFetchingAll(true);
    setFetchProgress({ current: 1, total: totalPages });

    // Start with posts from page 1
    const posts: Post[] = [...firstPage.posts];

    let cancelled = false;

    const fetchAllPages = async () => {
      for (let page = 2; page <= totalPages; page++) {
        if (cancelled) return;

        try {
          await new Promise((resolve) => setTimeout(resolve, 250));

          if (cancelled) return;

          const result = await fetchPosts(page, 50);
          if (result instanceof DetailedApiError) {
            console.error(`Error fetching page ${page}:`, result);
            continue;
          }

          posts.push(...result.posts);
          if (!cancelled) {
            setFetchProgress({ current: page, total: totalPages });
          }
        } catch (err) {
          console.error(`Error fetching page ${page}:`, err);
        }
      }

      if (!cancelled) {
        setAllPosts(posts);
        setIsFetchingAll(false);
      }
    };

    fetchAllPages();

    return () => {
      cancelled = true;
    };
  }, [firstPage]);

  const chartData = useMemo(() => {
    if (allPosts.length === 0) {
      return null;
    }

    let misinfoCount = 0;
    let trueCount = 0;

    allPosts.forEach((post) => {
      if (post.misinfoState !== null) {
        if (post.potentialMisinformation) {
          misinfoCount++;
        } else if (post.misinfoState === 1) {
          trueCount++;
        }
      }
    });

    return {
      misinfoCount,
      trueCount,
      total: misinfoCount + trueCount,
    };
  }, [allPosts]);

  const option = useMemo(() => {
    if (!chartData) {
      return {};
    }

    return {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        textStyle: {
          fontSize: isMobile ? 12 : 14,
        },
      },
      legend: {
        orient: isMobile ? "horizontal" : "vertical",
        left: isMobile ? "center" : "left",
        top: isMobile ? "bottom" : "middle",
        bottom: isMobile ? 0 : "auto",
        textStyle: {
          fontSize: isMobile ? 12 : 14,
        },
        itemGap: isMobile ? 20 : 10,
      },
      series: [
        {
          name: "Posts",
          type: "pie",
          radius: isMobile ? ["30%", "60%"] : ["40%", "70%"],
          center: isMobile ? ["50%", "45%"] : ["60%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: !isMobile,
            formatter: "{b}: {c}\n({d}%)",
            fontSize: isMobile ? 10 : 12,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: isMobile ? 14 : 16,
              fontWeight: "bold",
            },
            scale: true,
            scaleSize: 5,
          },
          labelLine: {
            show: !isMobile,
          },
          data: [
            {
              value: chartData.misinfoCount,
              name: "Misinformation Posts",
              itemStyle: {
                color: "#ed333b",
              },
            },
            {
              value: chartData.trueCount,
              name: "Factual Posts",
              itemStyle: {
                color: "#26a269",
              },
            },
          ],
        },
      ],
    };
  }, [chartData, isMobile]);

  const isLoading = isLoadingFirst || isFetchingAll;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts Distribution</CardTitle>
          <CardDescription>
            {isFetchingAll
              ? `Loading posts... (${fetchProgress.current} of ${fetchProgress.total} pages)`
              : "Loading chart data..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`flex flex-col items-center justify-center gap-4 ${
              isMobile ? "h-[300px]" : "h-[400px]"
            }`}
          >
            <div className="text-muted-foreground text-sm sm:text-base">
              {isFetchingAll
                ? `Fetching page ${fetchProgress.current} of ${fetchProgress.total}...`
                : "Loading..."}
            </div>
            {isFetchingAll && (
              <div className="w-full max-w-xs">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{
                      width: `${
                        (fetchProgress.current / fetchProgress.total) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts Distribution</CardTitle>
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

  if (!chartData || chartData.total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Posts Distribution</CardTitle>
          <CardDescription>No posts available</CardDescription>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts Distribution</CardTitle>
        <CardDescription>
          Misinformation Posts vs Factual Posts ({chartData.total} verified
          posts)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-2">
        <ReactECharts
          option={option}
          style={{ height: isMobile ? "300px" : "400px", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </CardContent>
    </Card>
  );
}
