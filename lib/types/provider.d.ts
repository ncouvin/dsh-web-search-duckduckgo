/**
 * `DuckDuckGoSearchProvider`: a free, anti-bot resilient `WebSearchProvider`
 * backed by DuckDuckGo with multi-tier fallback. Requires zero API keys or credentials.
 *
 * @module @deepseek-ai/dsh-web-search-duckduckgo/provider
 */
import type { WebSearchProvider, WebSearchRequest, WebSearchResult } from '@deepseek-ai/dsh-web';
/** Stable id this provider registers under. */
export declare const DUCKDUCKGO_PROVIDER_ID = "duckduckgo";
/** Provider configuration options. */
export interface DuckDuckGoSearchProviderOptions {
    /** Optional custom User-Agent. */
    userAgent?: string;
}
/** DuckDuckGo resilient search provider. */
export declare class DuckDuckGoSearchProvider implements WebSearchProvider {
    private readonly options;
    readonly id = "duckduckgo";
    constructor(options?: DuckDuckGoSearchProviderOptions);
    available(): boolean;
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
}
//# sourceMappingURL=provider.d.ts.map