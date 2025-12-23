export default function Footer() {
  const date = new Date();
  
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "12px 0",
        marginTop: "24px",
      }}
    >
      &copy; {date.getFullYear()}
    </footer>
  );
}
