import { body } from 'express-validator';


const newGroupValidator = () => body('name').notEmpty().withMessage('name is required').body('members').isArray().withMessage('members is required');