import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { BrainCircuit } from "lucide-react";

export default function ResearchPage() {
  return (
    <>
      <Header>
        <SidebarTrigger />
        <VerticalSeparator />
        <BrainCircuit className="mx-1" color="#ed333b" /> Research
      </Header>
    </>
  );
}
