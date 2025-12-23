import { WalletConnectButton } from "./WalletConnect";

export function Header() {
  return <header
    style={{
      display: "flex",
      backgroundColor: "red",
      padding: "12px",
    }}
  >
    <div style={{ flex: "1" }}>
      <h1 style={{ fontSize: "24px" }}>Logo</h1>
    </div>
    <WalletConnectButton />
  </header>;
}
