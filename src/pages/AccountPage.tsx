import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import Header from "@/components/ui/header";
import { SidebarTrigger } from "@/components/ui/sidebar";
import VerticalSeparator from "@/components/ui/verticalseparator";
import { FolderX, UserPen } from "lucide-react";
import { Link } from "react-router-dom";

export default function AccountPage() {
  return (
    <>
      <Header className="mb-3">
        <SidebarTrigger />
        <VerticalSeparator />
        <UserPen className="mx-1" color="#33d17a" />
        Your Account
      </Header>
      <Empty className="h-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderX />
          </EmptyMedia>
          <EmptyTitle>Not Functional</EmptyTitle>
          <EmptyDescription>This page is not yet functional as it is out of scope at the moment.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button><Link to="/">Back To Home</Link></Button>
        </EmptyContent>
      </Empty>
    </>
  );
}
