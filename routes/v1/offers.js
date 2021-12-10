import OfferController from '@controllers/OfferController'
import { isLoggedIn } from '@middleware/auth'
import { saveSessionBanner } from '@helpers/multer'
import { Router } from 'express'

const router = Router()
router.get('/', OfferController.getAll)
router.get('/:id', OfferController.getOne)
router.post('/', [isLoggedIn(), saveSessionBanner], OfferController.create)
router.put('/:id', [isLoggedIn(), saveSessionBanner], OfferController.update)
router.delete('/:id', isLoggedIn(), OfferController.delete)

export default router
