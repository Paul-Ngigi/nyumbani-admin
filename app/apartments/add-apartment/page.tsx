import { AddApartmentForm } from "@/components/apartments/AddApartmentForm";
import BaseLayout from "@/components/shared/BaseLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddUnitForm } from "@/components/units/AddUnitForm";

export default function Page() {
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/apartments">Apartments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Add Apartment</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="font-bold">Add Apartments</h1>

        <Card>
          <CardHeader>
            <CardTitle>New Apartments Form</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <AddApartmentForm />            
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
