/* eslint-disable @typescript-eslint/method-signature-style */
import 'lodash';

declare module 'lodash' {
	interface LoDashStatic {
		toPairs< T, TKey extends keyof T >(
			obj: T | undefined | null
		): [ TKey, T[ TKey ] ][];
	}
}
