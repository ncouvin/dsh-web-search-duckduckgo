import z from "@deepseek-ai/schemastery";
import { WebError } from "@deepseek-ai/dsh-web";
//#region lib/types/provider.js
/**
* `DuckDuckGoSearchProvider`: a free `WebSearchProvider` backed by DuckDuckGo.
* Requires no API key and no paid subscription.
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
/** DuckDuckGo free search provider. */
var DuckDuckGoSearchProvider = class {
	options;
	id = DUCKDUCKGO_PROVIDER_ID;
	constructor(options = {}) {
		this.options = options;
	}
	/** Always available: requires no credentials or paid API tokens. */
	available() {
		return true;
	}
	/**
	* Search DuckDuckGo using form-encoded POST to bypass bot detection/captchas,
	* parsing organic search results directly.
	*/
	async search(request, signal) {
		if (signal?.aborted === true) throw searchAborted(signal);
		const userAgent = this.options.userAgent ?? DEFAULT_USER_AGENT;
		const body = new URLSearchParams({
			q: request.query,
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
			throw new WebError(`DuckDuckGo search request failed: ${String(error)}`, "WEB_PROVIDER_ERROR", { cause: error });
		}
		if (!response.ok) throw new WebError(`DuckDuckGo search error (HTTP ${response.status})`, "WEB_PROVIDER_ERROR");
		const blocks = (await response.text()).split(/<div[^>]*class="[^"]*result\s+results_links[^"]*"/);
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
				const title = titleMatch[2].replace(/<[^>]+>/g, "").trim();
				let snippet = "";
				if (snippetMatch?.[1] !== void 0) snippet = snippetMatch[1].replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
				sources.push({
					url: rawUrl,
					...title.length > 0 ? { title } : {},
					...snippet.length > 0 ? { snippet } : {}
				});
			}
		}
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
