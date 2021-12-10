import UserController from '@controllers/UserController'
import { isLoggedIn } from '@middleware/auth'
import User from '@models/User'
import { Router } from 'express'
import { check } from 'express-validator'
import { saveAvatarAndBanner } from '@helpers/multer'

const router = Router({ strict: true })
router.get('/', isLoggedIn(true), UserController.getAll)
router.get('/me', isLoggedIn(), UserController.getMe)
router.get('/:id', isLoggedIn(), UserController.getOne)
router.get('/verify/:code', UserController.verifyEmail)
router.post(
  '/join',
  [
    check('email').isEmail().normalizeEmail(),
    check('password').not().isEmpty()
  ],
  UserController.register
)
router.put(
  '/me',
  [isLoggedIn(), saveAvatarAndBanner],
  UserController.update
)
router.post(
  '/me',
  [
    check('email').isEmail().normalizeEmail(),
    check('password').not().isEmpty()
  ],
  UserController.login
)
router.delete('/me', isLoggedIn(), UserController.logout)
router.delete('/:id', isLoggedIn(true), UserController.deleteUser)
router.post(
  '/forgot',
  [check('email').isEmail().normalizeEmail()],
  UserController.sendResetPasswordEmail
)
router.get('/reset/:code', UserController.verifyResetPasswordCode)
router.post(
  '/reset/:code',
  [check('password').not().isEmpty()],
  UserController.resetPassword
)

export default router
