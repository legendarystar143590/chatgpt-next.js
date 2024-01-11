import { getServerSession } from "next-auth";
import Head from "./head";
import { SessionProvider } from "../components/SessionProvider";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Login from "../components/Login";
import "../styles/globals.css";
import "../styles/loading.css";
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
      <Head />
      <body>
        {/* <SessionProvider session={session}>
          {!session ? (
            <Login />
          ) : ( */}
          {children}
          {/* )}
        </SessionProvider> */}
        <ToastContainer />
      </body>
    </html>
  );
}
