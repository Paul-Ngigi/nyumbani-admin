import { ApartmentBasicDetailsForm } from "@/components/apartments/ApartmentBasicDetailsForm";
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
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/apartments/add-apartment/step_one">
              Basic Details
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="font-bold">Add Apartments</h1>

      <Card>
        <CardHeader>
          <CardTitle>New Apartments Form</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ApartmentBasicDetailsForm />
        </CardContent>
      </Card>
    </div>
  );
}
