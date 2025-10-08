import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';

const router = Router();

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getBookings);
router.patch('/:id/status', bookingController.updateBookingStatus);

export default router;