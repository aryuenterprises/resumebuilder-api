import { Router } from 'express';
import { completePasswordReset, getUserById, googleLogin, initiatePasswordReset, login, register, verifyOtp } from '../Controller/authAdmin';


const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/login/google', googleLogin);
router.post('/password-reset/initiate', initiatePasswordReset);
router.post('/password-reset/complete', completePasswordReset);
router.get('/user/:id', getUserById);

export default router;
