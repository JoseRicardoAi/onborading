---
name: tech-search
description: |
  Self-contained deep tech research. Concurrent Native Tools (search_web + read_url_content).
  Pipeline: Query > Decompose > Concurrent Search & Read > Evaluate > Synthesize > Document.
  Zero external dependencies. MCPs optional.
  Salva em docs/research/{YYYY-MM-DD}-{slug}/.
---

# Tech Search

Self-contained deep research pipeline. Zero external dependencies.

## Quick Start

```
/tech-search "React Server Components vs Client Components"
```

## Activation

1. Parse query from `$ARGUMENTS` (or ask if not provided)
2. Execute 6-phase workflow
3. Save to `docs/research/{YYYY-MM-DD}-{slug}/`

**CRITICAL:**
- NEVER implement code. Redirect to @pm or @dev.
- NEVER write files outside `docs/research/`.

---

## SKILL DEFINITION

```yaml
skill:
  name: Tech Search
  id: tech-search

veto_conditions:
  - id: VETO_NO_RESULTS
    trigger: "ALL search waves return 0 results"
    action: "STOP + Report: 'No results found. Reformulate query or check connectivity.'"

  - id: VETO_IMPLEMENTATION_REQUEST
    trigger: "User asks to implement, code, create agent/skill, or deploy"
    action: "REDIRECT: 'Implementation is not my scope. Use @pm for prioritization or @dev for execution.'"
    keywords:
      - "implementa"
      - "cria o agent"
      - "cria a skill"
      - "faz o codigo"
      - "escreve o codigo"
      - "desenvolve"
      - "deploy"
      - "implement"
      - "build this"
      - "code this"

  - id: VETO_FORBIDDEN_PATH
    trigger: "Attempt to write outside docs/research/"
    action: "BLOCK + Error: 'Writing outside docs/research/ is forbidden.'"

constraints:
  forbidden_actions:
    - NEVER implement code, agents, skills, or production artifacts
    - NEVER create files outside docs/research/
    - NEVER write to .Antigravity/agents/, .Antigravity/skills/, squads/, app/, lib/

tool_hierarchy:
  search:
    1_preferred: "Exa MCP (mcp__exa__web_search_exa) - if available"
    2_fallback: "WebSearch (always available)"
    detection: "Try Exa first. If 401/429/503, set exa_available=false, use WebSearch."

  docs:
    1_preferred: "Context7 MCP (mcp__context7__resolve-library-id + query-docs) - if available"
    2_fallback: "WebSearch with 'site:{library}.dev docs' or 'site:{library}.io docs'"
    detection: "Try Context7 first. If fails, set context7_available=false."

  deep_read:
    only: "read_url_content tool directly"
    note: "No ETL, no shell, no external scripts. Pure read_url_content."

  execution_model:
    type: "concurrent-tools"
    engine: "antigravity natively (search_web + read_url_content)"
    max_parallel_queries: 5
    max_reads_per_query: 3

workflow:
  phases:

    # ──────────────────────────────────────────────
    # PHASE 1: AUTO-CLARIFY
    # ──────────────────────────────────────────────
    1_auto_clarify:
      name: "Auto-Clarification"
      model_tier: "MAIN MODEL (inline)"
      description: |
        Pattern matching + technology detection on the user query.
        Determines if clarification is needed or can be skipped.

      execution: |
        1. Read user query (original text, unmodified)

        2. PATTERN MATCHING (case-insensitive):
           - Technical keywords: "code", "implement", "how to", "api", "bug",
             "error", "debug", "library", "sdk", "tutorial", "example"
             → inferred_context.focus = "technical"
           - Comparison keywords: "compare", "vs", "versus", "difference",
             "better", "alternative", "tradeoff", "pros and cons"
             → inferred_context.focus = "comparison"
           - Recency keywords: "latest", "new", "2024", "2025", "2026",
             "recent", "state of the art", "trending"
             → inferred_context.temporal = "recent"
             → Append current year to search queries

        3. TECHNOLOGY DETECTION (case-insensitive):
           Scan for known technologies:
           - Languages: JavaScript/JS, TypeScript/TS, Python, Java, Go, Rust, C#, Ruby, PHP
           - Frameworks: React, Next.js, Vue, Angular, Svelte, Express, FastAPI, Django, Flask
           - Databases: PostgreSQL, MySQL, MongoDB, Redis, Supabase, Firebase, Elasticsearch
           - AI/ML: LLM, RAG, LangChain, OpenAI, Antigravity, Anthropic, TensorFlow, PyTorch
           - Infra: Docker, Kubernetes, AWS, Vercel, GraphQL, REST, WebSocket
           → Collect into inferred_context.domain = [list]

        4. DECISION:
           - IF any pattern OR technology detected → skip clarification
           - IF nothing detected → ask ONE question:
             "Your query seems broad. What is the focus and technical context?"

      output: "inferred_context object {focus, temporal, domain, skip_clarification}"

    # ──────────────────────────────────────────────
    # PHASE 2: DECOMPOSE
    # ──────────────────────────────────────────────
    2_decompose:
      name: "Query Decomposition"
      model_tier: "MAIN MODEL"
      description: |
        Decomposes user query into 5-7 atomic, directly searchable sub-queries.
        Uses extended thinking for deeper analysis.

      execution: |
        ultrathink

        1. DEEP ANALYSIS (use extended thinking):
           - What are the REAL questions behind this query?
           - What would a domain expert want to know?
           - What gaps might standard searches miss?
           - What assumptions should be tested?

        2. GENERATE 5-7 sub-queries that:
           - Cover ORTHOGONAL angles (not overlapping)
           - Include at least one "devil's advocate" query
           - Include at least one "expert-level" query
           - Are directly searchable (not abstract)

        3. INCORPORATE inferred_context:
           - If focus=comparison → ensure queries cover both/all sides
           - If temporal=recent → add year constraints
           - If domain detected → scope queries to those technologies

        4. OUTPUT format:
           {
             "main_topic": "string",
             "sub_queries": ["query1", "query2", ...],
             "search_strategy": "parallel"
           }

      output: "decomposition_result JSON"

    # ──────────────────────────────────────────────
    # PHASE 3: CONCURRENT SEARCH & FETCH
    # ──────────────────────────────────────────────
    3_concurrent_search:
      name: "Concurrent Search & Fetch (Antigravity Native)"
      model_tier: "MAIN MODEL (Concurrent Tools)"
      description: |
        Dispatches all sub-queries as parallel tool calls in the same turn.
        Step A: Execute search_web concurrently for all queries.
        Step B: Parse URLs and execute read_url_content concurrently on the best ones.

      execution: |
        1. CONCURRENT SEARCH DISPATCH:
           Instead of spawning subagents, invoke the `search_web` tool concurrently
           for each of the 5-7 sub-queries.
           Example: <call:search_web{query:"..."}><call:search_web{query:"..."}>

        2. URL SELECTION:
           Review the search results and select the top 2-3 most relevant and
           authoritative URLs per sub-query.

        3. CONCURRENT FETCH DISPATCH:
           Invoke the `read_url_content` tool concurrently for all selected URLs
           across all sub-queries in a single batch.

        4. AGGREGATE RESULTS:
           Extract the specific facts/numbers/benchmarks, code examples (preserve exactly),
           best practices, warnings, and expert recommendations from the fetched markdown.
           Format as structured internal memory.

      output: |
        {
           "search_results": [...],
           "tools_used": {"search_web": N, "read_url_content": N},
           "fetch_stats": {"dispatched": N, "succeeded": N, "failed": N}
        }

    # ──────────────────────────────────────────────
    # PHASE 4: EVALUATE COVERAGE
    # ──────────────────────────────────────────────
    4_evaluate_coverage:
      name: "Coverage Evaluation"
      model_tier: "MAIN MODEL"
      description: |
        Evaluates if research is complete. Decides CONTINUE or STOP.
        Max 2 waves total (simpler than tech-research's 3 waves).

      execution: |
        1. Calculate metrics:
           - coverage_score (0-100): How well do findings answer the original query?
           - source_quality: Count HIGH/MEDIUM/LOW credibility sources
           - new_info_ratio: Estimate unique facts vs total

        2. STOPPING RULES:
           HARD STOPS (always stop):
           - wave >= 2 → "Max iterations reached"
           - coverage_score >= 80 AND high_credibility >= 3 → "Sufficient coverage"

           SOFT STOP:
           - coverage_score >= 65 AND wave >= 1 → "Acceptable coverage"

           MUST CONTINUE:
           - coverage_score < 50 AND wave == 1 → "Insufficient first wave"

        3. IF CONTINUE:
           - Generate 2-3 targeted gap-filling queries
           - Return to Phase 3 (search again with new queries)

        4. IF STOP:
           - Document final score and remaining gaps

      output: |
        {
          "decision": "CONTINUE|STOP",
          "coverage_score": 0-100,
          "stop_reason": "reason",
          "gaps": [...],
          "next_queries": [...] (if CONTINUE)
        }

    # ──────────────────────────────────────────────
    # PHASE 5: SYNTHESIZE
    # ──────────────────────────────────────────────
    5_synthesize:
      name: "Synthesize"
      model_tier: "MAIN MODEL"
      description: |
        Consolidates all findings into a comprehensive research report.
        Produces DOCUMENTATION ONLY, never production code.

      execution: |
        1. Review all aggregated search results and findings
        2. Identify patterns, consensus, and contradictions across sources
        3. Rank techniques/solutions by evidence strength
        4. Generate:
           - Executive summary (TL;DR)
           - Detailed findings organized by theme
           - Code examples for REFERENCE only (not production)
           - Decision matrix: when to use what
           - Practical next steps recommending @pm or @dev
        5. ALWAYS end with "Next Steps" section redirecting to implementation agents

      output: "Synthesized report content"

    # ──────────────────────────────────────────────
    # PHASE 6: DOCUMENT
    # ──────────────────────────────────────────────
    6_document:
      name: "Document"
      model_tier: "MAIN MODEL"
      description: "Save complete research to docs/research/"
      structure:
        folder: "docs/research/{YYYY-MM-DD}-{slug}/"
        files:
          - name: "README.md"
            content: "Index + TL;DR"
          - name: "00-query-original.md"
            content: "Original question + inferred context"
          - name: "01-deep-research-prompt.md"
            content: "Generated structured prompt with sub-queries"
          - name: "02-research-report.md"
            content: "Complete research findings"
          - name: "03-recommendations.md"
            content: "Recommendations and next steps (NO production code)"

security:
  - Never include API keys or secrets in research docs
  - Sanitize sensitive paths before saving
  - Validate URLs before fetching
  - NEVER write files outside docs/research/
  - NEVER create agents, skills, or production code

scope_boundaries:
  allowed_paths:
    - "docs/research/**"
  forbidden_paths:
    - ".antigravity/agents/"
    - ".antigravity/skills/"
    - "squads/"
    - "app/"
    - "lib/"
    - "src/"
    - "*.ts"
    - "*.tsx"
    - "*.js"
    - "*.py"
  exception: "Code examples within docs/research/ markdown are allowed for DOCUMENTATION only"
```

---

## Execution Flow

```
Query → Auto-Clarify → Decompose (ultrathink, MAIN MODEL)
                              |
              [Sub-query 1]  [Sub-query 2]  ... [Sub-query 5]
                   |              |                   |
            (Concurrent search_web invocations from MAIN MODEL)
                   |              |                   |
            (Collect URLs & Concurrent read_url_content calls)
                   |              |                   |
                   +------+-------+-------+-----------+
                          |
                    Aggregate (MAIN MODEL)
                          |
                    Evaluate Coverage (MAIN MODEL)
                          |
                    (coverage OK?) ── NO ──→ [Wave 2, max 2 total]
                          | YES
                          |
                    Synthesize (MAIN MODEL)
                          |
                    Document (MAIN MODEL)
```

## What This Skill Does NOT Have

- No ETL service dependency
- No infrastructure/ references
- No squads/ references
- No Bash commands
- No custom agents (uses built-in general-purpose)
- No Python/JS scripts
- No npm dependencies
- No wave compression (max 2 waves, context is sufficient)
- No citation verification (simplifies without quality loss)
- No follow-up behavior (run again for more research)
- No BlogDiscovery or SemanticChunker

## Output Structure

```
docs/research/{YYYY-MM-DD}-{slug}/
├── README.md                    # Index + TL;DR
├── 00-query-original.md         # Original question + context
├── 01-deep-research-prompt.md   # Generated prompt with sub-queries
├── 02-research-report.md        # Complete findings
└── 03-recommendations.md        # Recommendations (NO production code)
```
