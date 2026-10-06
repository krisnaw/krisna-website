export const BLOG_ORIGIN = "https://krisna-blog.krisna-w2010.workers.dev";

export type EmdashResponse = {
	status: number;
	body: unknown;
};

export async function emdashGet(path: string): Promise<EmdashResponse> {
	const { env } = await import("cloudflare:workers");
	const key = env.EM_DASH_KEY;

	if (!key) {
		return { status: 0, body: null };
	}

	const request = new Request(new URL(path, BLOG_ORIGIN), {
		headers: { Authorization: `Bearer ${key}` },
	});
	// A public fetch to another workers.dev host is rejected with error 1042.
	const response = env.BLOG
		? await env.BLOG.fetch(request)
		: await fetch(request);

	if (!response.ok) {
		return { status: response.status, body: null };
	}

	return { status: response.status, body: await response.json() };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}
