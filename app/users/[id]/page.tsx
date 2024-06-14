import ListTenants from "@/components/ListTenants";
import ListUnits from "@/components/ListUnits";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserDetails from "@/components/users/Details/UserDetails";

export default function page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <BaseLayout>
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/users">Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Details</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <UserDetails _id={id}/>
      </div>
    </BaseLayout>
  );
}
