"use client";

import { isSuperAdmin } from "@/actions/AppService";
import FormatTimestamp from "@/components/shared/FormatTimestamp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IRole, IUser } from "@/interfaces/user.interface";
import { FC, useEffect, useState } from "react";
import UpdateRole from "./UpdateRole";

/* eslint-disable react-hooks/exhaustive-deps */

interface IRentDetails {
  user: IUser;
}

const RentDetails: FC<IRentDetails> = ({ user }) => {
  const [trueRoles, setTrueRoles] = useState<string[]>([]);

  const [roles, setRoles] = useState<IRole[]>([]);

  const [superAdmin, setIsSuperAdmin] = useState<boolean>(false);

  const getTrueRoles = (userRoles: IRole[]): string[] => {
    return userRoles
      .filter((role) => Object.values(role)[0] === true)
      .map((role) => Object.keys(role)[0]);
  };

  const populateTrueRoles = () => {
    if (user?.roles) {
      setTrueRoles(getTrueRoles(user.roles));
    }
  };

  const getPossessiveForm = (name: string): string => {
    return name.endsWith("s") ? `${name}'` : `${name}'s`;
  };

  useEffect(() => {
    populateTrueRoles();
    setRoles(user.roles);
    setIsSuperAdmin(isSuperAdmin(roles));
    console.log({roles})
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rent Details</CardTitle>
        <CardDescription>Rent information about user</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 w-full space-y-4">
          <div>
            <div className="font-medium">Current Month</div>
            <div className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName}
            </div>
          </div>
          <div>
            <div className="font-medium">Rental Bill</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
          <div>
            <div className="font-medium">Water Bill</div>
            <div className="text-sm text-muted-foreground">
              {user?.telephone1}
            </div>
          </div>
          <div>
            <div className="font-medium">Garbage Fee</div>
            <div className="text-sm text-muted-foreground">
              {user?.postalAddress}
            </div>
          </div>
          <div>
            <div className="font-medium">Electricity Bill</div>
            <div className="text-sm text-muted-foreground">
              <FormatTimestamp timestamp={user?._timestamp || 0} />
            </div>
          </div>
          <div>
            <div className="font-medium">Total Bill</div>
            <div className="text-sm text-muted-foreground">
              <FormatTimestamp
                timestamp={user?._utimestamp ?? user?._timestamp ?? 0}
              />
            </div>
          </div>          
          {superAdmin && (
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">P</Button>
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RentDetails;
