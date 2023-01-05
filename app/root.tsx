import { Outlet, LiveReload, Link, Links, Meta } from "@remix-run/react"
import globalStylesUrl from "~/styles/global.css"

type Props = {
  title?: string
  children?: React.ReactNode
}

export const links = (): object[] => [
  { rel: "stylesheet", href: globalStylesUrl },
]
export const meta = (): object => {
  const description = "My first Remix app"
  const keywords = "remix, react, javascript"

  return {
    description,
    keywords,
  }
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
        <Meta />
        <Links />
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
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>

        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  )
}

export const ErrorBoundary = ({ error }) => {
  console.log(error)
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  )
}
