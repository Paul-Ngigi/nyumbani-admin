import ListUsers from "@/components/users/ListUsers";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import ListInquiries from "@/components/inquiries/ListInquiries";


export default function Page() {  
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/Inquiries">Inquiries</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold">Inquiries</h1>

        <ListInquiries/>
      </div>
    </BaseLayout>
  );
}
