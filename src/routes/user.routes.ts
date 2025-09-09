import { Router } from 'express';
import { getUsers, getUser, createUser, deleteUser, getMe } from '../controllers/user.controller.js';
import { updateUser } from '../controllers/updatedUser.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validateRequest.js';
import { validateUserUpdate } from '../middlewares/validateUserUpdate.js';

const router = Router();

// Aplicar el middleware de autenticación a todas las rutas
router.use(protect);

// Rutas
router.route('/')
  .get(getUsers)
  .post(validate, createUser);

router.route('/me')
  .get(getMe);

router.route('/:id')
  .get(validate, getUser)
  .put(validateUserUpdate, updateUser)
  .delete(validate, deleteUser);

export default router;
