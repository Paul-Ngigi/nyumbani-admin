"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import BasicDetails from "./BasicDetails";
import ListApartments from "@/components/apartments/ListApartments";
import ListInquiries from "@/components/inquiries/ListInquiries";
import ListComplaints from "@/components/complaints/ListComplaints";
import ListLeaveNotices from "@/components/leave-notices/ListLeaveNotices";

interface UserDetails {
  _id: string;
}

const UserDetails: FC<UserDetails> = ({ _id }) => {
  return (
    <Tabs defaultValue="basic">
      <TabsList>
        <TabsTrigger value="basic">Basic Details</TabsTrigger>
        <TabsTrigger value="apartments">Apartments</TabsTrigger>
        <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        <TabsTrigger value="complaints">Complaints</TabsTrigger>
        <TabsTrigger value="arrears">Arrears</TabsTrigger>
        <TabsTrigger value="leave">Leave Notice</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <BasicDetails _id={_id} />
      </TabsContent>
      <TabsContent value="apartments" className="h-full">
        <ListApartments />
      </TabsContent>
      <TabsContent value="inquiries">
        <ListInquiries />
      </TabsContent>
      <TabsContent value="complaints">
        <ListComplaints />
      </TabsContent>
      <TabsContent value="arrears">Arrears.</TabsContent>
      <TabsContent value="leave">
        <ListLeaveNotices />
      </TabsContent>
      <TabsContent value="payments">Payments.</TabsContent>
    </Tabs>
  );
};

export default UserDetails;
