import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { BrainCircuit } from "lucide-react";
import { MisinfoPieChart } from "@/components/ui/misinfo-pie-chart";
import { TNSEScatterChart } from "@/components/ui/tnse-scatter-chart";
import { TopicActivitiesSunburstChart } from "@/components/ui/topic-activities-sunburst-chart";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ResearchPage() {
  return (
    <>
      <Header className="mb-3">
        <SidebarTrigger />
        <VerticalSeparator />
        <BrainCircuit className="mx-1" color="#ed333b" /> Research
      </Header>
      <div className="flex relative min-h-0">
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col mb-5 max-w-[900px] w-full px-2 sm:px-0 gap-5">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts Distribution</TabsTrigger>
                <TabsTrigger value="semantic">Semantic Space</TabsTrigger>
                <TabsTrigger value="topics">Topic Activities</TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-5">
                <MisinfoPieChart />
              </TabsContent>
              <TabsContent value="semantic" className="mt-5">
                <TNSEScatterChart />
              </TabsContent>
              <TabsContent value="topics" className="mt-5">
                <TopicActivitiesSunburstChart />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
