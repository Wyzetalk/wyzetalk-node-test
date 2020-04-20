import { Router, Request, Response } from 'express';

import {
  getNextEvents,
  getAllEvents,
  getEventsByProvince,
  getEventById,
  getEventBySearch,
  getPagedEvents,
  getAppData,
  removeEventById,
} from '../services/events';

import asyncHandler from 'express-async-handler';

const router: Router = Router();

router.route('/:id')
  .delete(async (req: Request, res: Response) => {
    try {
      const { params: { id } } = req;
      const data = removeEventById(id);
      return res.send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

router.route('/next')
  .get(asyncHandler(async (req: Request, res: Response) => {
    try {
      const resp = await getNextEvents();
      return res.json(resp);
    } catch (error) {
      return res.sendStatus(500);
    }
  }));

router.route('/all/:sport')
  .get(async (req: Request, res: Response) => {
    try {
      const { params: { sport } } = req;
      const data = await getAllEvents(sport);
      res.send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

router.route('/provinse/:sport/:region')
  .get(async (req: Request, res: Response) => {
    const { params, query } = req;
    const { sport, region } = params;
    const { isArchive } = query;

    try {
      const results = await getEventsByProvince(sport, region, isArchive);
      res.send(results);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

router.route('/id/:id')
  .get(async (req: Request, res: Response) => {
    try {
      const { params: { id } } = req;
      const data = await getEventById(id);
      res.send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

router.route('/search/:query')
  .get(async (req: Request, res: Response) => {
    try {
      const { params: { query } } = req;
      // @ts-ignore
      const data = await getEventBySearch(query);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

router.route('/paged')
  .get(async (req: Request, res: Response) => {
    try {
      const { query: { offset, limit, sport } } = req;

      const data = await getPagedEvents(offset, limit, sport);
      res.send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

router.route('/setup')
  .get(async (req: Request, res: Response) => {
    try {
      const data = await getAppData('running');
      res.send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  });

export default router;
