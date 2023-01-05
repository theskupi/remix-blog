import { Outlet } from "@remix-run/react"

const Posts: React.FC = () => {
  return (
    <div>
      {/* <p>This is a posts route</p> */}
      <Outlet />
    </div>
  )
}

export default Posts
