import { Hero } from "@/components/section/hero";
import { Feater } from "@/components/section/featurs";
import { LogManagement } from "@/components/section/logManagement";
import { StatusPage } from "@/components/section/statusPage";
import { HappyCustomers } from "@/components/section/happy-customers";

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
