// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

/// <reference types="@testing-library/jest-dom" />

import type { AuthRecord } from 'pocketbase'
import type PocketBase from 'pocketbase'

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase
			user: AuthRecord
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}
