import '../styles/globals.css'
import Navbar from '@/components/Navbar'
import {getNavbar} from '@/lib/contentful'

export const metadata = {
  title: 'Fit For Life Trainer',
  description: 'Fit For Life Personal Training to transform your way of life.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navbar = await getNavbar()

  return (
    <html lang="en" className="h-full">
      <body className="h-full pt-28">
        <Navbar entry={navbar} />
        <div>{children}</div>
      </body>
    </html>
  )
}
