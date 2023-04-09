import { createMock } from '@golevelup/ts-jest';
import { CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable, firstValueFrom, of } from 'rxjs';

import { KordisRequest } from '@kordis/api/shared';
import { createContextForRequest } from '@kordis/api/test-helpers';
import { AuthUser } from '@kordis/shared/auth';

import { AuthUserExtractorStrategy } from '../auth-user-extractor-strategies/auth-user-extractor.strategy';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
	let mockAuthUserExtractor: AuthUserExtractorStrategy;
	let service: AuthInterceptor;

	beforeEach(() => {
		mockAuthUserExtractor = new (class extends AuthUserExtractorStrategy {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			getUserFromRequest(req: KordisRequest): AuthUser | null {
				return undefined;
			}
		})();
		service = new AuthInterceptor(mockAuthUserExtractor);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should throw unauthorized http exception', async () => {
		jest
			.spyOn(mockAuthUserExtractor, 'getUserFromRequest')
			.mockReturnValue(null);

		await expect(
			firstValueFrom(
				service.intercept(
					createContextForRequest(createMock<KordisRequest>()),
					createMock<CallHandler>(),
				),
			),
		).rejects.toThrow(UnauthorizedException);
	});

	it('should continue request pipeline', async () => {
		jest.spyOn(mockAuthUserExtractor, 'getUserFromRequest').mockReturnValue({
			id: '123',
			firstName: 'foo',
			lastName: 'bar',
			email: 'foo@bar.de',
		});

		const handler = createMock<CallHandler>({
			handle(): Observable<boolean> {
				return of(true);
			},
		});

		const ctxMock = createContextForRequest(createMock<KordisRequest>());

		await expect(
			firstValueFrom(service.intercept(ctxMock, handler)),
		).resolves.toBeTruthy();
	});
});
