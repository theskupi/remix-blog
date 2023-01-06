import { json, redirect } from "@remix-run/node"
import { Link, useActionData } from "@remix-run/react"
import { db } from "~/utils/db.server"

function validateInput(input: string, charLength: number) {
  if (typeof input !== "string" || input.length < charLength) {
    return `Title should be at least ${charLength} characters long.`
  }
}

export const action = async ({ request }) => {
  const form = await request.formData()
  const title = form.get("title")
  const body = form.get("body")

  const fields = { title, body }

  const fieldErrors = {
    title: validateInput(title, 3),
    body: validateInput(body, 10),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    return json({ fieldErrors, fields }, { status: 400 })
  }

  const post = await db.post.create({ data: fields })
  return redirect(`/posts/${post.id}`)
}

const NewPost: React.FC = () => {
  const actionData = useActionData()

  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">
        <form method="post">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.title &&
                  actionData?.fieldErrors?.title}
              </p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post body</label>
            <textarea
              name="body"
              id="body"
              defaultValue={actionData?.fields?.body}
            />
            <div className="error">
              <p>
                {actionData?.fieldErrors?.body && actionData?.fieldErrors?.body}
              </p>
            </div>
          </div>
          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </form>
      </div>
    </>
  )
}

export default NewPost
