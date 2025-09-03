import './globals.css';

export const metadata = {
  title: 'Your App',
  description: 'Your Description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
          {children}
      </body>
    </html>
  );
}
