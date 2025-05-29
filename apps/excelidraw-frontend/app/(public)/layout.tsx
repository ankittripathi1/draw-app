import { NavigationHeader } from "@/components/NavigationHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavigationHeader />
      {children}
    </>
  );
}
