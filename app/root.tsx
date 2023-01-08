import { Outlet, LiveReload, Link, Links, Meta } from '@remix-run/react'
import globalStylesUrl from '~/styles/global.css'
import { getUser } from './utils/session.server'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/node'

type Props = {
  title?: string
  children?: React.ReactNode
}

export type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>
}

export const links = (): object[] => [
  { rel: 'stylesheet', href: globalStylesUrl },
]
export const meta = (): object => {
  const description = 'My first Remix app'
  const keywords = 'remix, react, javascript'

  return {
    description,
    keywords,
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user,
  }
  return data
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
        <title>{title ? title : 'Remix Blog'}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

const Layout: React.FC<Props> = ({ children }) => {
  const { user } = useLoaderData() as LoaderData

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
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  )
}

export const ErrorBoundary = (error: Error) => {
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
