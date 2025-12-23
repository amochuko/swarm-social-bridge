import { Outlet } from "react-router";
import Footer from "./Footer";
import { Header } from "./Header";
import ProtectedRoute from "./ProtectedRoute";

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
      <main style={{ flex: 1 }}>
        <ProtectedRoute redirectTo="/">
          <Outlet />
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  );
}
