"use client";

import React from "react";
import { useSession } from "next-auth/react";
import BaseLayout from "@/components/shared/BaseLayout";
import AgentDashboard from "./agent-dashboard/AgentDashboard";
import ClientDashboard from "./client-dashboard/ClientDashboard";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";

const Dashboard = () => {
  const { data: session } = useSession();
  const userRoles = session?.roles || [];

  let dashboardComponent = null;

  switch (true) {
    case userRoles.some((role) => role.superadmin):
      dashboardComponent = <SuperAdminDashboard />;
      break;
    case userRoles.some((role) => role.admin):
      dashboardComponent = <AgentDashboard />;
      break;
    case userRoles.some((role) => role.client):
      dashboardComponent = <ClientDashboard />;
      break;
    default:
      dashboardComponent = <div>No Dashboard Available</div>;
  }

  return <>{dashboardComponent}</>;
};

export default Dashboard;
