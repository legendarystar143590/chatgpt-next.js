import { SessionProvider } from "../components/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from "../components/Login";
import "../styles/globals.css";
import "../styles/loading.css";
import ClientProvider from "../components/ClientProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await getServerSession(authOptions);
  return (
    <html>
      <head />
      <body>
        {/* <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : ( */}
            <div className="flex justify-center h-screen bg-gradient-to-r from-slate-700 to-slate-800 p-4">
              {/* <div className="bg-[#202123] max-w-xs h-screen overflow-y-auto md:min-w-[20rem]">
                <SideBar />
              </div> */}

              <ClientProvider />

              <div className="md:w-[70%] lg:w-[50%] h-full lg:p-6 p-3 w-full bg-slate-900 rounded-2xl">{children}</div>
            </div>
          {/* )}
        </SessionProvider> */}
        <ToastContainer />
      </body>
    </html>
  );
}
