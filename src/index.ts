/**
 * `@deepseek-ai/dsh-web-search-duckduckgo`: registers a free DuckDuckGo `WebSearchProvider`
 * with `ctx.web`. A Cordis plugin requiring zero API keys or external credentials.
 *
 * @module @deepseek-ai/dsh-web-search-duckduckgo
 */

import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-web'
import { DuckDuckGoSearchProvider } from './provider.ts'

export {
  DuckDuckGoSearchProvider,
  DUCKDUCKGO_PROVIDER_ID,
} from './provider.ts'
export type { DuckDuckGoSearchProviderOptions } from './provider.ts'

/** Cordis plugin name used by loader diagnostics and YAML configuration. */
export const name = 'web-search-duckduckgo'

/** The web seam this provider registers into. */
export const inject = ['web']

/** Plugin configuration schema. */
export interface Config {
  /** Optional custom User-Agent. */
  userAgent?: string
}

export const Config: z<Config> = z.object({
  userAgent: z.string(),
})

/** Register the DuckDuckGo search provider with `ctx.web`. */
export function apply(ctx: Context, config: Config): void {
  ctx.web.registerSearchProvider(new DuckDuckGoSearchProvider({
    ...config.userAgent !== undefined ? { userAgent: config.userAgent } : {},
  }))
}
