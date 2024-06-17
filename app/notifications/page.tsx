import ListUsers from "@/components/users/ListUsers";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import ListNotifications from "@/components/notifications/ListNotifications";


export default function Page() {  
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/notifications">Notifications</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold">Notifications</h1>

        <ListNotifications/>
      </div>
    </BaseLayout>
  );
}
