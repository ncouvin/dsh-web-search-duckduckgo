/**
 * `@deepseek-ai/dsh-web-search-duckduckgo`: registers a free DuckDuckGo `WebSearchProvider`
 * with `ctx.web`. A Cordis plugin requiring zero API keys or external credentials.
 *
 * @module @deepseek-ai/dsh-web-search-duckduckgo
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
export { DuckDuckGoSearchProvider, DUCKDUCKGO_PROVIDER_ID, } from './provider.ts';
export type { DuckDuckGoSearchProviderOptions } from './provider.ts';
/** Cordis plugin name used by loader diagnostics and YAML configuration. */
export declare const name = "web-search-duckduckgo";
/** The web seam this provider registers into. */
export declare const inject: string[];
/** Plugin configuration schema. */
export interface Config {
    /** Optional custom User-Agent. */
    userAgent?: string;
}
export declare const Config: z<Config>;
/** Register the DuckDuckGo search provider with `ctx.web`. */
export declare function apply(ctx: Context, config: Config): void;
//# sourceMappingURL=index.d.ts.map