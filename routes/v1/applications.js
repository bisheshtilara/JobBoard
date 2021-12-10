import ApplicationController from '@controllers/ApplicationController'
import { isLoggedIn } from '@middleware/auth'
import { Router } from 'express'

const router = Router({ strict: true })
router.get('/', isLoggedIn(), ApplicationController.getUserApplicationsList)
router.get('/offer/:id', isLoggedIn(), ApplicationController.getOfferApplicationsList)
router.get('/user/:id', isLoggedIn(true), ApplicationController.getUserApplicationsListAdmin)
router.post('/', isLoggedIn(), ApplicationController.applyOffer)
router.get('/:id', isLoggedIn(), ApplicationController.getApplication)
router.put('/:id/:choice', isLoggedIn(), ApplicationController.acceptOrReject)
router.delete('/:id', isLoggedIn(), ApplicationController.cancel)

export default router
