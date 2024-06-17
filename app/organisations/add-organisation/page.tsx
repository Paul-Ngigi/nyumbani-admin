import { AddOrganisationsForm } from "@/components/organisations/AddOrganisationsForm";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/agents">Organisations</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Add Organisation</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold">Add Organisation</h1>

        <Card>
          <CardHeader>
            <CardTitle>New Organisation Form</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AddOrganisationsForm />
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
