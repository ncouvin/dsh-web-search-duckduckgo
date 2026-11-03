/**
 * `@deepseek-ai/dsh-web-search-duckduckgo`: registers a free DuckDuckGo `WebSearchProvider`
 * with `ctx.web`. A Cordis plugin requiring zero API keys or external credentials.
 *
 * @module @deepseek-ai/dsh-web-search-duckduckgo
 */
import z from '@deepseek-ai/schemastery';
import { DuckDuckGoSearchProvider } from "./provider.js";
export { DuckDuckGoSearchProvider, DUCKDUCKGO_PROVIDER_ID, } from "./provider.js";
/** Cordis plugin name used by loader diagnostics and YAML configuration. */
export const name = 'web-search-duckduckgo';
/** The web seam this provider registers into. */
export const inject = ['web'];
export const Config = z.object({
    userAgent: z.string(),
});
/** Register the DuckDuckGo search provider with `ctx.web`. */
export function apply(ctx, config) {
    ctx.web.registerSearchProvider(new DuckDuckGoSearchProvider({
        ...config.userAgent !== undefined ? { userAgent: config.userAgent } : {},
    }));
}
//# sourceMappingURL=index.js.map