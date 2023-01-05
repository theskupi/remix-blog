import { Outlet, LiveReload, Link } from "@remix-run/react"

type Props = {
  title?: string
  children?: React.ReactNode
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}

const Document: React.FC<Props> = ({ title, children }) => {
  return (
    <html>
      <head>
        <title>{title ? title : "Remix Blog"}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  )
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <nav>
        <Link to="/" className="logo">
          Remix
        </Link>

        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
        </ul>

        <div className="container">{children}</div>
      </nav>
    </>
  )
}
