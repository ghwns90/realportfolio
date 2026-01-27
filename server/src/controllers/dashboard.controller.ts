import * as dashboardService from '../services/dashboard.service';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const dashboardStats = await dashboardService.getDashBoardStats();

    res.status(200).json(dashboardStats);
  } catch (error) {
    next(error);
  }
}