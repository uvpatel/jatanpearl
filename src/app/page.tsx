import type { Metadata } from "next";
import { RoyaleInvitation } from "@/components/sites/royale/invitation";
import "./templates/royale/royale.css";

export const metadata: Metadata = {
  title: "Pearl & Jatan - Destination Wedding Invitation",
  description:
    "Destination Wedding invitation for Pearl & Jatan in Anand, Gujarat & Mandavgarh (Mandu), Madhya Pradesh. 15 January – 2 February 2027.",
};

export default function Home() {
  return <RoyaleInvitation />;
}
