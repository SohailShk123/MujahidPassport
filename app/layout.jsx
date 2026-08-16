import './globals.css'

export const metadata = {
  title: 'PassportDesk CRM',
  description: 'Passport service office management workspace',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}