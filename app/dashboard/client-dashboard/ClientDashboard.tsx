"use client";

import BaseLayout from "@/components/shared/BaseLayout";
import CoreStats from "../components/CoreStats";
import TransactionStats from "../components/TransactionStats";
import UserStats from "../components/UserStats";

export default function ClientDashboard() {
  return (
    <BaseLayout>
      <div className="w-full flex flex-col gap-3">
        <h1 className="font-bold">Client Dashboard</h1>

        <CoreStats />
        <TransactionStats />
        <UserStats />
      </div>
    </BaseLayout>
  );
}
