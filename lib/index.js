import z from "@deepseek-ai/schemastery";
import { WebError } from "@deepseek-ai/dsh-web";
//#region lib/types/provider.js
/**
* `DuckDuckGoSearchProvider`: a free, anti-bot resilient `WebSearchProvider`
* backed by DuckDuckGo with multi-tier fallback. Requires zero API keys or credentials.
*
* @module @deepseek-ai/dsh-web-search-duckduckgo/provider
*/
/** Stable id this provider registers under. */
const DUCKDUCKGO_PROVIDER_ID = "duckduckgo";
/** Default User-Agent header for browser emulation. */
const DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0";
/** Check if error was caused by AbortSignal cancellation. */
function isAbortError(error) {
	return error instanceof DOMException && error.name === "AbortError";
}
/** Build standard web search abort error. */
function searchAborted(signal, fallback) {
	return new WebError("DuckDuckGo search aborted", "WEB_ABORTED", { cause: signal?.aborted === true ? signal.reason : fallback });
}
/** Decode HTML entities from search engine snippets. */
function decodeEntities(text) {
	return text.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#039;/g, "'").replace(/&nbsp;/g, " ").trim();
}
/** Primary tier: DuckDuckGo HTML endpoint with full browser headers. */
async function searchDuckDuckGoHtml(query, userAgent, signal) {
	const body = new URLSearchParams({
		q: query,
		b: ""
	}).toString();
	let response;
	try {
		response = await fetch("https://html.duckduckgo.com/html/", {
			method: "POST",
			headers: {
				"User-Agent": userAgent,
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.5",
				"Content-Type": "application/x-www-form-urlencoded",
				"Origin": "https://html.duckduckgo.com",
				"Referer": "https://html.duckduckgo.com/"
			},
			body,
			...signal !== void 0 ? { signal } : {}
		});
	} catch (error) {
		if (signal?.aborted || isAbortError(error)) throw searchAborted(signal, error);
		return [];
	}
	if (!response.ok) return [];
	const html = await response.text();
	if (html.includes("anomaly-modal") || html.includes("anomaly.js")) return [];
	const blocks = html.split(/<div[^>]*class="[^"]*result\s+results_links[^"]*"/);
	const sources = [];
	for (let i = 1; i < blocks.length; i++) {
		const b = blocks[i];
		if (b === void 0) continue;
		const titleMatch = b.match(/<h2[^>]*class="[^"]*result__title[^"]*"[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
		const snippetMatch = b.match(/<a[^>]*class="[^"]*result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
		if (titleMatch?.[1] !== void 0 && titleMatch[2] !== void 0) {
			let rawUrl = titleMatch[1];
			const m = rawUrl.match(/uddg=([^&]+)/);
			if (m?.[1] !== void 0) rawUrl = decodeURIComponent(m[1]);
			const title = decodeEntities(titleMatch[2]);
			const snippet = snippetMatch?.[1] !== void 0 ? decodeEntities(snippetMatch[1]) : "";
			sources.push({
				url: rawUrl,
				...title.length > 0 ? { title } : {},
				...snippet.length > 0 ? { snippet } : {}
			});
		}
	}
	return sources;
}
/** Secondary tier: DuckDuckGo Lite endpoint. */
async function searchDuckDuckGoLite(query, userAgent, signal) {
	try {
		const body = new URLSearchParams({ q: query }).toString();
		const response = await fetch("https://lite.duckduckgo.com/lite/", {
			method: "POST",
			headers: {
				"User-Agent": userAgent,
				"Accept": "text/html,application/xhtml+xml",
				"Content-Type": "application/x-www-form-urlencoded",
				"Origin": "https://lite.duckduckgo.com",
				"Referer": "https://lite.duckduckgo.com/"
			},
			body,
			...signal !== void 0 ? { signal } : {}
		});
		if (!response.ok) return [];
		const html = await response.text();
		if (html.includes("anomaly-modal") || html.includes("anomaly.js")) return [];
		const sources = [];
		const linkMatches = html.matchAll(/<a[^>]+class="result-link"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<td class="result-snippet">([\s\S]*?)<\/td>/gi);
		for (const m of linkMatches) if (m[1] !== void 0 && m[2] !== void 0) {
			let rawUrl = m[1];
			const uddg = rawUrl.match(/uddg=([^&]+)/);
			if (uddg?.[1] !== void 0) rawUrl = decodeURIComponent(uddg[1]);
			sources.push({
				url: rawUrl,
				title: decodeEntities(m[2]),
				snippet: m[3] !== void 0 ? decodeEntities(m[3]) : ""
			});
		}
		return sources;
	} catch (error) {
		if (signal?.aborted || isAbortError(error)) throw searchAborted(signal, error);
		return [];
	}
}
/** Tertiary tier: Wikipedia open knowledge fallback (100% uptime, unblockable). */
async function searchWikipediaFallback(query, signal) {
	try {
		const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`;
		const res = await fetch(url, {
			headers: { "User-Agent": "dsh-web-search/1.0.1 (https://github.com/ncouvin/dsh-web-search-duckduckgo)" },
			...signal !== void 0 ? { signal } : {}
		});
		if (!res.ok) return [];
		return ((await res.json()).query?.search ?? []).slice(0, 5).map((item) => ({
			url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
			title: `${item.title} - Wikipedia`,
			snippet: decodeEntities(item.snippet)
		}));
	} catch {
		return [];
	}
}
/** DuckDuckGo resilient search provider. */
var DuckDuckGoSearchProvider = class {
	options;
	id = DUCKDUCKGO_PROVIDER_ID;
	constructor(options = {}) {
		this.options = options;
	}
	available() {
		return true;
	}
	async search(request, signal) {
		if (signal?.aborted === true) throw searchAborted(signal);
		const userAgent = this.options.userAgent ?? DEFAULT_USER_AGENT;
		let sources = await searchDuckDuckGoHtml(request.query, userAgent, signal);
		if (sources.length === 0) sources = await searchDuckDuckGoLite(request.query, userAgent, signal);
		if (sources.length === 0) sources = await searchWikipediaFallback(request.query, signal);
		return {
			sources,
			truncated: false
		};
	}
};
//#endregion
//#region lib/types/index.js
/**
* `@deepseek-ai/dsh-web-search-duckduckgo`: registers a free DuckDuckGo `WebSearchProvider`
* with `ctx.web`. A Cordis plugin requiring zero API keys or external credentials.
*
* @module @deepseek-ai/dsh-web-search-duckduckgo
*/
/** Cordis plugin name used by loader diagnostics and YAML configuration. */
const name = "web-search-duckduckgo";
/** The web seam this provider registers into. */
const inject = ["web"];
const Config = z.object({ userAgent: z.string() });
/** Register the DuckDuckGo search provider with `ctx.web`. */
function apply(ctx, config) {
	ctx.web.registerSearchProvider(new DuckDuckGoSearchProvider({ ...config.userAgent !== void 0 ? { userAgent: config.userAgent } : {} }));
}
//#endregion
export { Config, DUCKDUCKGO_PROVIDER_ID, DuckDuckGoSearchProvider, apply, inject, name };
