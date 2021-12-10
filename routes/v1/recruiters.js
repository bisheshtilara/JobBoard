import UserController from '@controllers/UserController'
import { Router } from 'express'

const router = Router()

router.get('/', UserController.getAllRecruiters)
router.get('/:id', UserController.getRecruiter)

export default router