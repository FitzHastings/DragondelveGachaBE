import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { SessionDto } from '../dto/session.dto';

@Injectable()
export class IsAdminGuard implements CanActivate {
    public canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const session: SessionDto = request.user;
        return session.role === 'admin';
    }
}