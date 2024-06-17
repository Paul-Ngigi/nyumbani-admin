import ListUsers from "@/components/users/ListUsers";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import ListLeaveNotices from "@/components/leave-notices/ListLeaveNotices";


export default function Page() {  
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/leave-notices">Leave Notices</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold">Leave Notices</h1>

        <ListLeaveNotices/>
      </div>
    </BaseLayout>
  );
}
