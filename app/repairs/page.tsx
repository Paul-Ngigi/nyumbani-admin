import ListUsers from "@/components/users/ListUsers";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import ListRepairs from "@/components/repairs/ListRepairs";


export default function Page() {  
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/repairs">Repairs</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold">Repairs</h1>

        <ListRepairs/>
      </div>
    </BaseLayout>
  );
}
