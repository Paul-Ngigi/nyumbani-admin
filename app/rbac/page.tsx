import ListRbacs from "@/components/rbac/ListRbac";
import ListRoles from "@/components/roles/ListRoles";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rbac">Roles & Permissions</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="font-bold">Roles & Permissions</h1>
        <Tabs defaultValue="roles">
          <TabsList>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="mapping">Permission Roles Mapping</TabsTrigger>
          </TabsList>
          <TabsContent value="roles">
            <ListRoles />
          </TabsContent>
          <TabsContent value="mapping">
            <ListRbacs />
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}
