"use client";

import BaseLayout from "@/components/shared/BaseLayout";
import CoreStats from "../components/CoreStats";


export default function SuperAdminDashboard() {
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-3">
        <h1 className="font-bold">Super Admin Dashboard</h1>

        <CoreStats />        
      </div>
    </BaseLayout>
  );
}
