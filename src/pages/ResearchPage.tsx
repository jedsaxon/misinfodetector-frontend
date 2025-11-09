import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { BrainCircuit } from "lucide-react";
import { MisinfoPieChart } from "@/components/ui/misinfo-pie-chart";

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
          <div className="flex flex-col mb-5 max-w-[900px] w-full px-2 sm:px-0">
            <MisinfoPieChart />
          </div>
        </div>
      </div>
    </>
  );
}
