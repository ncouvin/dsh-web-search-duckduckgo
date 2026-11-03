/**
 * `DuckDuckGoSearchProvider`: a free `WebSearchProvider` backed by DuckDuckGo.
 * Requires no API key and no paid subscription.
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
/** DuckDuckGo free search provider. */
export declare class DuckDuckGoSearchProvider implements WebSearchProvider {
    private readonly options;
    readonly id = "duckduckgo";
    constructor(options?: DuckDuckGoSearchProviderOptions);
    /** Always available: requires no credentials or paid API tokens. */
    available(): boolean;
    /**
     * Search DuckDuckGo using form-encoded POST to bypass bot detection/captchas,
     * parsing organic search results directly.
     */
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
}
//# sourceMappingURL=provider.d.ts.map