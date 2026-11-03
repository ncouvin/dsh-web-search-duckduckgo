# 🦆 DuckDuckGo Search Provider for DeepSeek Harness

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-orange.svg?logo=buy-me-a-coffee)](https://buymeacoffee.com/kitopizzas)
[![DeepSeek Harness](https://img.shields.io/badge/Plugin%20For-DeepSeek%20Harness-blue.svg)](https://github.com/deepseek-ai/deepseek-harness)

A **100% free, zero-config, API-key-free** web search provider plugin for **[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)** (`ctx.web`).

---

## 💡 Why this plugin?

By default, DeepSeek Harness requires paid API keys for web search (`DeepSeek Messages API`, `Exa.ai`, or `Perplexity`). 

If you are running **local models** (such as Qwen 2.5 / 3.8, DeepSeek R1, Llama 3 via **Ollama**, **vLLM**, or **LM Studio**) to keep your setup completely private and free, paying for search APIs defeats the purpose.

This plugin connects the `web_search` tool directly to **DuckDuckGo**:
- 🆓 **100% Free**: No subscriptions, no credit cards, no tokens.
- 🔑 **Zero Credentials**: No API key needed.
- 🛡️ **Anti-Bot & CAPTCHA Resilient**: Sends browser-compliant requests with full citation and organic URL parsing.
- 🔌 **Seamless Integration**: Plugs cleanly into DeepSeek Harness's `ctx.web` seam without any core hacks.

---

## 📦 Installation & Setup

### Option 1: Use in your DeepSeek Harness deployment

1. Add the package to your DeepSeek Harness workspace:
```bash
pnpm add dsh-web-search-duckduckgo
```

2. Enable it in your `cordis.yml` (or `cordis.patch.yml`):
```yaml
plugins:
  web:
    searchProvider: duckduckgo

  web-search-duckduckgo: {}
```

### Option 2: Environment Variable
You can also set DuckDuckGo as your active search provider via environment variable:
```env
DSH_WEB_SEARCH_PROVIDER=duckduckgo
```

---

## 🧪 Verification

Once enabled, whenever your agent or local model executes `web_search`:
```
> web_search {"queries": ["RTX 3060 multi GPU local LLM"]}
```
It will retrieve live, real-time results from DuckDuckGo and feed citations and summaries directly into your conversation.

---

## ☕ Support the Project

If this plugin saves you money and helps you run your local AI agents with free internet search, consider buying me a coffee! Every coffee is greatly appreciated and helps maintain this plugin:

<a href="https://buymeacoffee.com/kitopizzas" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="180">
</a>

Or visit: [https://buymeacoffee.com/kitopizzas](https://buymeacoffee.com/kitopizzas)

---

## 📄 License

MIT License © 2026 [ncouvin](https://github.com/ncouvin)
