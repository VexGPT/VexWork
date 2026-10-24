# Vex Security Assurance — public availability and DDoS

`[VXG RealForever]`

## Human question

> If someone simply tries to make the public Vex/Vextreme site unavailable by flooding it, what already protects us, what merely improves resilience, and what infrastructure decision is still open?

This source preserves that question without pretending an infrastructure choice has already been made.

## Current source-backed deployment truth

Current Vextreme source identifies **two live public surfaces**:

```text
GitHub Pages
  role = source of truth / active development / v2 architecture

vextreme24.com on Squarespace
  role = production site / v1 loader surface
```

Public Vextreme source owners:

- `repo.vextreme:README.md`
- `repo.vextreme:docs/architecture/01-identity.md`
- `repo.vextreme:docs/continuity/INDEX.md`

This means the public-site architecture is **not source-described as GitHub Pages only**.

It also does **not** mean there is automatic failover between those surfaces. They are separate URLs/provider paths, so one remaining availability question is how a human discovers or reaches the surviving surface when another is impaired.

## Existing client-side resilience

Current Vextreme source already reduces some dependence on repeated origin requests:

- `repo.vextreme:lib/build-sw.js` precaches generated scripts and shared non-HTML assets and serves those assets cache-first;
- HTML is deliberately **never** intercepted by that service worker and remains network-fresh;
- `repo.vextreme:docs/architecture/05-browser.md` caches `index.json` locally, revalidates it in the background, and uses jsDelivr for a cold fetch path.

These mechanisms can help an already-loaded browser continue using cached assets and reduce repeated requests.

They are **resilience/caching controls, not DDoS controls**.

```text
BROWSER_CACHE != EDGE_DDOS_MITIGATION
SERVICE_WORKER != WAF
SECOND_PUBLIC_URL != AUTOMATIC_FAILOVER
STATIC_HOSTING != UNLIMITED_AVAILABILITY
```

## Existing provider-managed protection on the production surface

Squarespace currently documents that its platform:

- has solutions designed to protect against and mitigate DDoS attacks;
- uses WAF technology;
- uses geographically separate infrastructure / availability zones for continuity;
- supports high-traffic sites under managed hosting.

Squarespace also documents Cloudflare as an optional additional security/traffic layer for advanced needs rather than a universal requirement.

Canonical sources:

- https://www.squarespace.com/measures
- https://www.squarespace.com/security
- https://support.squarespace.com/hc/en-us/articles/213469948-Using-Cloudflare-with-Squarespace

This is provider evidence about the current `vextreme24.com` hosting surface. It does not prove Vex-specific configuration, an availability SLO, automatic failover, or protection of the separate GitHub Pages surface.

## Existing adjacent Cloudflare work

The private SDK currently contains a separately owned Cloudflare provider-family qualification for managed edge/stateful coordination. Public-safe facts already represented there include:

- Workers request compute;
- D1 and Durable Objects;
- quota/rate-abuse boundaries;
- Workers Rate Limiting;
- logs/traces/metrics;
- provider-specific portability/lock-in concerns.

That is useful prior art for Security Assurance, but it does **not** establish that Cloudflare was selected to host or proxy the Vextreme public website.

Public VexWork therefore points only to `repo.vextreme-sdk` plus the public-safe provider-family meaning. Private SDK implementation paths remain private/source-owned.

## Current external provider evidence

Observed 2026-10-23; revalidate before an infrastructure decision.

GitHub currently documents for GitHub Pages:

- a soft bandwidth limit of 100 GB/month;
- provider rate limiting may apply;
- when a site exceeds quotas, one suggested strategy is a third-party CDN in front of the site or moving to another hosting service.

Canonical source:

- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

Cloudflare currently documents:

- automatic DDoS detection/mitigation on its DDoS-protection service;
- standard unmetered DDoS protection across plans;
- WAF rate-limiting rules;
- Workers Rate Limiting bindings for application-specific limits.

Canonical sources:

- https://developers.cloudflare.com/ddos-protection/
- https://developers.cloudflare.com/waf/rate-limiting-rules/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

These are provider capabilities, not Vex commitments.

## Threat model

```text
protected outcome
  public readers can obtain the current public material

attacker goal
  deny or materially degrade that availability

likely pressure surfaces
  volumetric request flood
  application-layer request flood
  provider bandwidth / request quota exhaustion
  DNS / custom-domain disruption
  expensive unauthenticated dynamic endpoint abuse
  future provider-cost exhaustion

important distinction
  static public content
  != dynamic API / stateful service
```

A static site has less application compute to exhaust than a dynamic origin, but it can still become unavailable through provider limits, DNS/domain failure, platform outage, or edge/request exhaustion.

## Assurance questions

The Security Lens should eventually answer these per public surface:

```text
AVAIL-01
What exact provider receives public traffic first?

AVAIL-02
What DDoS / abuse protection does that provider actually supply at the selected plan/configuration?

AVAIL-03
Can an attacker reach an origin or expensive backend while bypassing the protective edge?

AVAIL-04
What bandwidth, request, build, storage or cost quota can make availability fail?

AVAIL-05
What happens when that quota is exhausted?

AVAIL-06
Is there a second independently reachable static copy?

AVAIL-07
Is failover automatic, operator-driven, or merely a documented alternate URL?

AVAIL-08
Can a returning reader still obtain useful content from local/browser cache?

AVAIL-09
Which future endpoints perform costly work before authentication, authorization or rate limiting?

AVAIL-10
What monitoring evidence would distinguish attack, provider outage, DNS failure and ordinary traffic growth?
```

## Mitigation ladder to evaluate, not assume

### M0 — current source-backed resilience

```text
GitHub Pages static v2 surface
+ Squarespace production surface
+ service-worker/static-asset caching
+ browser index cache
+ jsDelivr where currently used
```

Status: **OBSERVED RESILIENCE, NO WHOLE-SITE DDOS CLAIM**.

### M1 — provider configuration and recovery clarity

Candidate questions:

- authoritative DNS ownership and recovery;
- exact current GitHub Pages / Squarespace provider limits;
- alternate-surface discoverability;
- lightweight availability monitoring;
- incident/recovery route.

This can improve availability without changing hosting architecture.

### M2 — explicit protective edge

Evaluate an edge/CDN/proxy such as Cloudflare in front of the human-facing domain, with:

- automatic DDoS mitigation;
- cacheable static content served at the edge;
- WAF/rate limits where appropriate;
- origin/bypass analysis;
- TLS/DNS/currentness proof;
- cache invalidation and release-currentness proof.

This is a candidate architecture, **not accepted deployment truth**.

### M3 — provider-independent static mirror / failover

If the public-availability requirement eventually justifies it, evaluate a second independently deployed immutable static build (for example another edge/static provider) plus an explicit failover policy.

Do not add multi-provider complexity merely because it sounds safer. It should be earned by a stated availability objective, measured risk, operational burden and recovery requirement.

## Future dynamic services

Do not inherit the static-site threat model for Workers, APIs, discovery/rendezvous, model services or other dynamic Vex capabilities.

Those surfaces need additional controls such as:

```text
cheap rejection before expensive work
authentication / authorization before protected effects
per-identity / per-route limits
bounded queues and concurrency
provider quota and cost ceilings
backpressure
observability
safe degradation
```

The exact controls belong to the owning runtime/provider.

## Current disposition

```text
existing explicit Vextreme DDoS plan       = NOT_FOUND
current public deployment topology          = SOURCE_PROVEN
Squarespace provider DDoS/WAF capability     = PROVIDER_DOCUMENTED
client caching/resilience                    = SOURCE_PROVEN
automatic cross-provider failover            = NOT_PROVED
GitHub Pages Vex-specific DDoS assurance      = UNKNOWN
Cloudflare selected as public-site host       = NO
Cloudflare adjacent capability prior art      = SOURCE_PROVEN
whole public-site DDoS assurance              = UNKNOWN
next useful work                              = map exact traffic/DNS/provider boundary,
                                                then decide whether M1 is sufficient
                                                or an M2/M3 Spike is warranted
```

<!-- [VXG RealForever][VEXWORK][SECURITY-ASSURANCE][PUBLIC-AVAILABILITY][DDOS] -->
