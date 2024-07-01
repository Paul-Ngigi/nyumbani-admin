"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { IRole, IUser } from "@/interfaces/user.interface";
import axiosClient from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { FC, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { processHttpErrors } from "@/actions/ProcessHttpErrors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UpdateRole from "./UpdateRole";
import FormatTimestamp from "@/components/shared/FormatTimestamp";

/* eslint-disable react-hooks/exhaustive-deps */

interface IBasicDetails {
  _id: string;
}

const BasicDetails: FC<IBasicDetails> = ({ _id }) => {
  const [user, setUser] = useState<IUser>();
  const [trueRoles, setTrueRoles] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [payload, setPayload] = useState<any>({
    _id: _id,
  });

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
        populateTrueRoles();
        setIsLoading(false);
      } else {
        toast({
          variant: "warning",
          title: res.Message,
          description: res.Payload,
        });
        setIsLoading(false);
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
    mutation.mutate(payload);
  }, []);

  const getTrueRoles = (userRoles: IRole[]): string[] => {
    return userRoles
      .filter((role) => Object.values(role)[0] === true)
      .map((role) => Object.keys(role)[0]);
  };

  const populateTrueRoles = () => {
    if (user) {
      setTrueRoles(getTrueRoles(user.roles));
    }
  };

  const getPossessiveForm = (name: string): string => {
    return name.endsWith("s") ? `${name}'` : `${name}'s`;
  };

  return (
    <>
      {!isLoading && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Basic information about user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 w-full space-y-4">
              <div>
                <div className="font-medium">Full Name</div>
                <div className="text-sm text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </div>
              </div>
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  {user?.email}
                </div>
              </div>
              <div>
                <div className="font-medium">Phone Number</div>
                <div className="text-sm text-muted-foreground">
                  {user?.telephone1}
                </div>
              </div>
              <div>
                <div className="font-medium">Address</div>
                <div className="text-sm text-muted-foreground">
                  {user?.postalAddress}
                </div>
              </div>
              <div>
                <div className="font-medium">Created At</div>
                <div className="text-sm text-muted-foreground">
                  <FormatTimestamp timestamp={user?._timestamp || 0} />
                </div>
              </div>
              <div>
                <div className="font-medium">Updated At</div>
                <div className="text-sm text-muted-foreground">
                  <FormatTimestamp
                    timestamp={user?._utimestamp ?? user?._timestamp ?? 0}
                  />
                </div>
              </div>
              <div>
                <div className="font-medium">Roles</div>
                <div className="text-sm text-muted-foreground">
                  {trueRoles.map((role, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="capitalize"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change User Role</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Update {getPossessiveForm(user?.firstName ?? "")} role
                      </DialogTitle>
                      <DialogDescription>
                        <UpdateRole />
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <>
          <div className="font-medium">Loading...</div>
        </>
      )}
    </>
  );
};

export default BasicDetails;
