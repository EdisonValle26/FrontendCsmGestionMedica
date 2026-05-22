import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const tokenService = inject(TokenService);

    const token = tokenService.getToken();

    // endpoints públicos
    const publicUrls = [
        '/auth/login',
        '/auth/reset-password'
    ];

    const isPublic = publicUrls.some(url =>
        req.url.includes(url)
    );

    if (token && !isPublic) {

        req = req.clone({
            setHeaders: {
                Authorization: `${token}`
            }
        });

    }

    return next(req);

};