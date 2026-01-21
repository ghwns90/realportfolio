import * as dashboardService from '../services/dashboard.service';
import { Request, Response } from 'express';

export const getDashboard = async (req: Request, res: Response) => {

  try {
    const dashboardStats = await dashboardService.getDashBoardStats();

    res.status(200).json(dashboardStats);
  } catch (error) {
    res.status(500).json({message: '대쉬보드 조회중 에러'});
  }
}