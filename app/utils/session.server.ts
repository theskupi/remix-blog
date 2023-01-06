import { createCookieSessionStorage, redirect } from '@remix-run/node'
import bcrypt from 'bcrypt'
import { db } from './db.server'

interface IUserCreds {
  username: string
  password: string
}

export async function login({ username, password }: IUserCreds) {
  const user = await db.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) return null

  const isCorrectPass = await bcrypt.compare(password, user.passwordHash)

  if (!isCorrectPass) return null

  return user
}

export async function register({ username, password }: IUserCreds) {
  const passwordHash = await bcrypt.hash(password, 10)
  return db.user.create({
    data: {
      username,
      passwordHash,
    },
  })
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('No Session Secret')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'remixblog_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 2592000,
    httpOnly: true,
  },
})

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await storage.commitSession(session) },
  })
}

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'))
}

export async function getUser(request: Request) {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    })
    return user
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'))

  return redirect('/auth/logout', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
