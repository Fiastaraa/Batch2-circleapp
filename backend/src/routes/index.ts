import { Router } from 'express';
import authRoutes from './auth';
import threadRoutes from './threads';
import userRoutes from './users';

const apiRouter = Router();

// Mount sub-routers
apiRouter.use(authRoutes);
apiRouter.use(threadRoutes);
apiRouter.use(userRoutes);

export default apiRouter;
