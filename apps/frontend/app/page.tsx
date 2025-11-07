import { Hero } from "@/components/sections/hero";
import { Feater } from "@/components/sections/featurs";
import { LogManagement } from "@/components/sections/logManagement";
import { StatusPage } from "@/components/sections/statusPage";
import { HappyCustomers } from "@/components/sections/happy-customers";

export default function Home() {
  return (
    <div>
      <Hero />
      <Feater />
      <LogManagement />
      <StatusPage />
      <HappyCustomers />
    </div>
  );
}