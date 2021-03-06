import { assertOrThrow } from '../utils'
import { USER_ROLES } from '../models/user'
import { NotFound } from '../errors'

export async function updateUser(req, res) {
  const config = res.app.get('config')
  const { User } = req.app.get('models')
  let { user } = res.locals
  const { email, password, lastName, firstName, bio } = req.body

  const passhash = User.hashPassword(password, config.salt)

  user = await user.update({
    email,
    password,
    lastName,
    firstName,
    passhash,
    bio,
    role: USER_ROLES.CUSTOMER
  })

  res.json(user)
}

export async function addUserPhoto(req, res) {
  const { user, file } = res.locals

  user.photoUrl = file.url
  await user.save()

  res.json({ user, file })
}

export async function deleteUser(req, res) {
  const { user } = res.locals

  await user.destroy()

  res.json({ status: 'ok' })
}

export async function uploadFile(req, res) {
  const { user, file } = res.locals
  const { UserUpload } = req.app.get('models')

  const userUpload = await UserUpload.create({
    uploadUrl: file.url,
    userId: user.id
  })

  res.json({ userUpload })
}

export async function getUserFiles(req, res) {
  const { user } = res.locals
  const { UserUpload } = req.app.get('models')

  const userUploads = await UserUpload.findAll({
    where: {
      userId: user.id
    }
  })

  res.json(userUploads)
}

export async function getUser(req, res) {
  const { userId } = req.params
  const { User } = req.app.get('models')

  const user = await User.findById(userId)

  assertOrThrow(user, NotFound, 'User not found')

  res.json(user)
}

export async function getUserBlogs(req, res) {
  const { userId } = req.params
  const { User, UserBlog } = req.app.get('models')

  const user = await User.findById(userId)

  assertOrThrow(user, NotFound, 'User not found')

  const blogs = await UserBlog.findAll({
    where: {
      userId
    },
    include: [{ all: true }]
  })

  res.json(blogs)
}
