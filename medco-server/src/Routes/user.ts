import { Router } from 'express';
import { UserController } from '../controller';
import { requireJwtMiddleware } from '../Middlewares';

const router = Router();

router.post('/signup', UserController.newUser);
router.post('/signin', UserController.loginUser);
//Get all users
router.get('/', requireJwtMiddleware, UserController.listAll);

// Get one user
router.get('/:id([0-9]+)', UserController.getOneById);

//Create a new user
// router.post('/', requireJwtMiddleware, UserController.newUser);

//Edit one user
router.patch('/:id([0-9]+)', requireJwtMiddleware, UserController.editUser);

//Delete one user
router.delete('/:id([0-9]+)', requireJwtMiddleware, UserController.deleteUser);

export default router;
