import ListUsers from "@/components/users/ListUsers";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";


export default function Page() {  
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/roles-permissions">Roles & Permissions</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold">Roles & Permissions</h1>

        <ListUsers/>
      </div>
    </BaseLayout>
  );
}
