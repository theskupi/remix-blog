import type { LoaderArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import { db } from '~/utils/db.server'
import { login, createUserSession, register } from '~/utils/session.server'
import { validateInput } from '../../utils/validateInput'
interface ActionParams extends LoaderArgs {
  request: any
}

export const badRequest = (data: object) => {
  return json(data, { status: 400 })
}

export const action = async ({ request }: ActionParams) => {
  const form = await request.formData()
  const loginType = form.get('loginType')
  const username = form.get('username')
  const password = form.get('password')

  const fields = { loginType, username, password }

  const fieldErrors = {
    username: validateInput(username, 3),
    password: validateInput(password, 6),
  }

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors)
    badRequest({ fieldErrors, fields })
  }

  switch (loginType) {
    case 'login': {
      const user = await login({ username, password })
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: 'Invalid Credentials' },
        })
      }

      return createUserSession(user.id, '/posts')
    }
    case 'register': {
      const userExists = await db.user.findFirst({
        where: {
          username,
        },
      })

      if (userExists) {
        return badRequest({
          fields,
          fieldErrors: {
            username: `User ${username} already exists.`,
          },
        })
      }

      const user = await register({ username, password })
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: 'Something went wrong when registering user.',
        })
      }

      return createUserSession(user.id, '/posts')
    }
    default: {
      return badRequest({
        fields,
        formError: 'Login type is not valid',
      })
    }
  }
}

function Login() {
  const actionData = useActionData()

  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>

      <div className="page-content">
        <form method="post">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type="radio"
                name="loginType"
                value="login"
                defaultChecked={
                  !actionData?.fields?.loginType ||
                  actionData?.fields?.loginType === 'login'
                }
              />{' '}
              Login
            </label>
            <label>
              <input type="radio" name="loginType" value="register" /> Register
            </label>
          </fieldset>

          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={actionData?.fields?.username}
            />
            <div className="error">{actionData?.fieldErrors?.username}</div>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={actionData?.fields?.password}
            />
            <div className="error">{actionData?.fieldErrors?.password}</div>
          </div>

          <button className="btn btn-block" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
