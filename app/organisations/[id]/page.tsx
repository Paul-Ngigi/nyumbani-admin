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

export default function page() {
  return (
    <BaseLayout>
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/apartments">Apartments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/apartments?tenants">
                Tenants
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Tabs defaultValue="tenants" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
          </TabsList>
          <TabsContent value="tenants">
            <ListTenants />
          </TabsContent>
          <TabsContent value="units">
            <ListUnits />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}
