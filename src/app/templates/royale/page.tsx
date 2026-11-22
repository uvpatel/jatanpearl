import type { Metadata } from "next";
import { RoyaleInvitation } from "@/components/sites/royale/invitation";
import "./royale.css";

export const metadata: Metadata = {
  title: "Pearl & Jatan - Destination Wedding Invitation",
  description:
    "Destination Wedding invitation for Pearl & Jatan in Anand, Gujarat & Mandavgarh (Mandu), Madhya Pradesh.",
};

export default function RoyalePage() {
  return <RoyaleInvitation />;
}
