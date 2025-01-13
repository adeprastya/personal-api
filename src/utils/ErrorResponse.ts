export class ErrorResponse extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = this.constructor.name;
		this.statusCode = statusCode;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}
