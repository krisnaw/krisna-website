interface BlogFetcher {
	fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

declare module "cloudflare:workers" {
	interface Env {
		EM_DASH_KEY: string;
		BLOG: BlogFetcher;
	}

	export const env: Env;
}
