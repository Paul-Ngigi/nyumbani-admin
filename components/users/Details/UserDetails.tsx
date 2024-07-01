"use client";

import { isAdmin, isAgent, isClient, isSuperAdmin } from "@/actions/AppService";
import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import ListApartments from "@/components/apartments/ListApartments";
import ListComplaints from "@/components/complaints/ListComplaints";
import ListInquiries from "@/components/inquiries/ListInquiries";
import ListLeaveNotices from "@/components/leave-notices/ListLeaveNotices";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { IRole, IUser } from "@/interfaces/user.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import BasicDetails from "./BasicDetails";
import RentDetails from "./RentDetails";

/* eslint-disable react-hooks/exhaustive-deps */

interface UserDetails {
  _id: string;
}

const UserDetails: FC<UserDetails> = ({ _id }) => {
  const [user, setUser] = useState<IUser>({} as IUser);

  const [roles, setRoles] = useState<IRole[]>([]);

  const [superAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [admin, setIsAdmin] = useState<boolean>(false);
  const [agentAdmin, setIsAgent] = useState<boolean>(false);
  const [tenant, setIsTenanat] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getUserById = async (data: any) => {
    let url = "/users";
    return await axiosClient.post(url, data);
  };

  const mutation: any = useMutation({
    mutationKey: ["userDetails"],
    mutationFn: (values) => getUserById(values),
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      const res = data.data.data;
      if (res.Status === 200) {
        setUser(res.Payload[0]);
        setRoles(user?.roles ?? ([] as IRole[]));
        setIsSuperAdmin(isSuperAdmin(roles));
        setIsAdmin(isAdmin(roles));
        setIsAgent(isAgent(roles));
        setIsTenanat(isClient(roles));
        setIsLoading(false);
      } else {
        if (res.Status === 401) {
          toast({
            variant: "destructive",
            title: "Invalid token",
            description: "User token has expired",
          });
          signOut({ callbackUrl: "/auth/login" });
        } else {
          toast({
            variant: "warning",
            title: res.Message,
            description: res.Payload,
          });
        }
      }
    },
    onError: (err: any) => {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Ooops! Something went wrong",
        description: processHttpErrors(err),
      });
    },
  });

  useEffect(() => {
    mutation.mutate({ _id: _id });
  }, []);

  return (
    <Tabs defaultValue="basic">
      <TabsList>
        <TabsTrigger value="basic">Basic Details</TabsTrigger>
        <TabsTrigger value="rent">Rent Details</TabsTrigger>
        <TabsTrigger value="apartments">Apartments</TabsTrigger>
        <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        <TabsTrigger value="complaints">Complaints</TabsTrigger>
        <TabsTrigger value="arrears">Arrears</TabsTrigger>
        <TabsTrigger value="leave">Leave Notice</TabsTrigger>
        <TabsTrigger value="payments">Payments</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        {isLoading ? <div>Loading...</div> : <BasicDetails user={user} />}
      </TabsContent>
      <TabsContent value="apartments" className="h-full">
        <ListApartments />
      </TabsContent>
      <TabsContent value="rent" className="h-full">
        <RentDetails user={user}/>
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
