import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import { getApiLimitCount } from "@/lib/api-limit";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount: any = await getApiLimitCount();

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 ">
        <Sidebar apiLimitCount={apiLimitCount} />
      </div>
      <main className="md:pl-72 w-full">
        <Navbar apiLimitCount={apiLimitCount}/>
        {children}
      </main>
    </div>
  );
};
export default DashboardLayout;
