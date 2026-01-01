import { Farmer } from 'orm/entities/farmers/Farmer';
import { Intermediary } from 'orm/entities/intermediaries/Intermediary';
import { PurchaseEnquiry } from 'orm/entities/enquiries/PurchaseEnquiry';

import { JwtPayload } from '../JwtPayload';

declare global {
  namespace Express {
    export interface Request {
      jwtPayload: JwtPayload;
      // Attached by ownership middleware
      enquiry?: PurchaseEnquiry;
      farmer?: Farmer;
      intermediary?: Intermediary;
    }
    export interface Response {
      customSuccess(httpStatusCode: number, message: string, data?: any): Response;
    }
  }
}
