import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    private readonly logger = new Logger(RequestLoggerMiddleware.name);

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, body, headers } = req;
        const userAgent = req.get('user-agent') || '';
        const ip = req.ip;

        this.logger.log(`${method} ${originalUrl} - ${userAgent} ${ip}`);

        // Log do body para requisições POST (exceto senhas)
        if (method === 'POST' && body) {
            const logBody = { ...body };
            if (logBody.password) {
                logBody.password = '***';
            }
            this.logger.log(`Body: ${JSON.stringify(logBody)}`);
        }

        // Log dos headers importantes
        this.logger.log(`Content-Type: ${headers['content-type'] || 'não definido'}`);
        this.logger.log(`Origin: ${headers.origin || 'não definido'}`);

        const start = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const duration = Date.now() - start;
            this.logger.log(`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
        });

        next();
    }
}