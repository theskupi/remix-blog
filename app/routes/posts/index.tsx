import { Link, useLoaderData } from "@remix-run/react"

interface IPostDetail {
  id: number
  title: string
  body: string
}

interface IPosts {
  posts: IPostDetail[]
}

export const loader = () => {
  const data: IPosts = {
    posts: [
      {
        id: 1,
        title: "Post 1",
        body: "This is a test post",
      },
      {
        id: 2,
        title: "Post 2",
        body: "This is a test post",
      },
      {
        id: 3,
        title: "Post 3",
        body: "This is a test post",
      },
    ],
  }
  return data
}

function PostItems() {
  const { posts } = useLoaderData()

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post: IPostDetail) => (
          <li key={post.id}>
            <Link to={post.id.toString()}>
              <h3>{post.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default PostItems
