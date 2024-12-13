import { Request } from 'express';
import { Admin } from 'src/models';

export interface RequestInteface extends Request {
  admin: Admin;
}
