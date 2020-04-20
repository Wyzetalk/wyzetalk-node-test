import { Request, Response, NextFunction } from 'express';

import basicAuth from 'basic-auth';

export default (req: Request, res: Response, next: NextFunction) => {
  const user = basicAuth(req);

  function unauthorized(resp: Response) {
    resp.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return resp.sendStatus(401);
  }

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }

  if (user.name === 'reme' && user.pass === 'remejuan123') {
    return next();
  } else {
    return unauthorized(res);
  }
};
