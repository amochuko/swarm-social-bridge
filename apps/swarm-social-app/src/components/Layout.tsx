import { Outlet } from "react-router";
import Footer from "./Footer";
import { Header } from "./Header";

export default function Layout() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        minHeight: "100vh",
        maxWidth: "1020px",
      }}
    >
      <Header />
      {/* <main style={{ flex: 1 }}>{children}</main> */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
