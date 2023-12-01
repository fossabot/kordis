import type { ValidationError } from 'class-validator';
import type { GraphQLFormattedError } from 'graphql/error';

import type {
	ValidationException,
	ValidationExceptionEntry,
} from '../core/validation.exception';
import { flattenValidationErrors } from '../flatten-class-validation-errors';
import { PresentableException } from './presentable.exception';

export class PresentableValidationException extends PresentableException {
	readonly code = 'VALIDATION_EXCEPTION';
	readonly graphqlError = {
		test: 123,
	};

	constructor(
		message: string,
		private readonly errors: ValidationExceptionEntry[],
	) {
		super(message);
	}

	static fromCoreValidationException(
		message: string,
		e: ValidationException,
	): PresentableValidationException {
		return new PresentableValidationException(message, e.errors);
	}

	static fromClassValidationErrors(
		errors: ValidationError[],
	): PresentableValidationException {
		const validationExceptionEntries: ValidationExceptionEntry[] =
			flattenValidationErrors(errors);

		return new PresentableValidationException(
			'Validierungsfehler',
			validationExceptionEntries,
		);
	}

	override asGraphQLError(): GraphQLFormattedError {
		const formattedError = super.asGraphQLError();
		if (!formattedError.extensions) formattedError.extensions = {};
		formattedError.extensions.errors = this.errors;

		return formattedError;
	}
}
