import { ApartmentPaymentDetailsForm } from "@/components/apartments/ApartmentPaymentDetailsForm";
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
              <BreadcrumbLink href="/apartments">Apartments</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Add Apartment</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/apartments/add-apartment/step_one">
                Payment Details
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
            <ApartmentPaymentDetailsForm />
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
}
