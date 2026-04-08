export const metadata = {
  title: "BrandWriter Partner Calculator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
