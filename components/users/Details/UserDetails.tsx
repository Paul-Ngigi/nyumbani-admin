"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FC } from "react";
import BasicDetails from "./BasicDetails";

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
      <TabsContent value="apartments">Apartments.</TabsContent>
      <TabsContent value="inquiries">Inquiries.</TabsContent>
      <TabsContent value="complaints">Complaints.</TabsContent>
      <TabsContent value="arrears">Arrears.</TabsContent>
      <TabsContent value="leave">Leave Notice.</TabsContent>
      <TabsContent value="payments">Payments.</TabsContent>
    </Tabs>
  );
};

export default UserDetails;
