import CompanyController from '@controllers/CompanyController'
import { isLoggedIn } from '@middleware/auth'
import { Router } from 'express'

const router = Router()
router.get('/', CompanyController.getAll)
router.get('/:id', CompanyController.getOne)
router.post('/', isLoggedIn(), CompanyController.create)
router.put('/:id', isLoggedIn(), CompanyController.update)
router.delete('/:id', isLoggedIn(), CompanyController.delete)
router.put('/emp/:id', isLoggedIn(), CompanyController.addEmployee)
router.delete('/emp/:id', isLoggedIn(), CompanyController.removeEmployee)
router.post('/subscribe/:id', isLoggedIn(), CompanyController.subscribe)
router.delete('/subscribe/:id', isLoggedIn(), CompanyController.unsubscribe)

export default router
