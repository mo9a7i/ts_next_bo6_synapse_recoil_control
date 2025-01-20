import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Razer Macro Config",
  description: "Configure your Razer Synapse 4 macros for Call of Duty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children; // Remove the HTML wrapper since it's handled by locale layout
}
