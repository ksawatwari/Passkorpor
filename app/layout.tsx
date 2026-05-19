import type {Metadata} from 'next';
import { Prompt, Anuphan } from 'next/font/google';
import './globals.css'; 

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-prompt',
  display: 'swap',
});

const anuphan = Anuphan({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-anuphan',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'สรุปอังกฤษ ก.พ. สอบผ่านชัวร์',
  description: 'คอร์สสรุปอังกฤษ ก.พ. ฉบับคนไม่มีพื้นฐาน',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="th" className={`${prompt.variable} ${anuphan.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-gray-900 bg-gray-50" suppressHydrationWarning>{children}</body>
    </html>
  );
}
