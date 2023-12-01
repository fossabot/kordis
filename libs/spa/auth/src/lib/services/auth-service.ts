import { InjectionToken } from '@angular/core';
import type { Observable } from 'rxjs';

import type { AuthUser } from '@kordis/shared/auth';

export interface AuthService {
	readonly user$: Observable<AuthUser | null>;
	readonly isAuthenticated$: Observable<boolean>;

	login(): void;

	logout(): void;
}

export const AUTH_SERVICE = new InjectionToken<AuthService>('AUTH_SERVICE');
