import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExpressReqInterface } from '../interface/expressreq.interface';

export const User = createParamDecorator((data: any, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<ExpressReqInterface>();
  if (!req.user) {
    return null;
  }
  if (data) {
    return req.user[data];
  }
  return req.user;
});
