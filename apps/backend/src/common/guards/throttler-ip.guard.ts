import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';

// NOTE: Throttler may not behave reliably in local/Postman.
// Intended mainly for production behind proxy/LB.
@Injectable()
export class ThrottlerIpGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    return (
      req.ip ||
      req.headers['x-forwarded-for'] ||
      'unknown'
    );
  }
}
