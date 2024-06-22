// app/[locale]/home/layout.tsx
import "../../globals.css";
import SideBar from "../components/SideBar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex">
      <SideBar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
