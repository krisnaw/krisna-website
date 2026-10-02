declare module "cloudflare:workers" {
	interface Env {
		EM_DASH_KEY: string;
	}

	export const env: Env;
}
