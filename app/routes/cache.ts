import { Router, Request, Response } from 'express';

import request from 'request';
import auth from '../auth/auth';
import apicache from 'apicache';

const router: Router = Router();

const provinces = [
  'ec',
  'fs',
  'kn',
  'li',
  'ga',
  'mp',
  'nc',
  'nw',
  'wc',
  'ls',
];

router.route('/')
  .get(auth, (req: Request, res: Response) => {
    apicache.clear(apicache.getIndex());

    provinces.forEach((pro) => {
      setTimeout(() => {
        request(`https://api.rtms.events/events/province/running/${pro}`);
      }, 1000);
      setTimeout(() => {
        request(`https://api.rtms.events/events/province/cycling/${pro}`);
      }, 1000);
    });

    return res.sendStatus(200);
  });

export default router;
