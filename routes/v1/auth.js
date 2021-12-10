import { Router } from 'express'
import UserController from '@controllers/UserController'
import { isLoggedIn } from '@middleware/auth'

const router = Router()

router.post(
  '/facebook',
  isLoggedIn(false, true),
  UserController.loginWithFacebook
)

export default router
