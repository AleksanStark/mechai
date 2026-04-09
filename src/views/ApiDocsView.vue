<script setup>
import { ref } from 'vue'
import MechCard  from '../components/ui/MechCard.vue'
import MechBadge from '../components/ui/MechBadge.vue'

const activeSection = ref('overview')
const copied        = ref('')

const sections = [
  { id: 'overview',       label: '// Overview'         },
  { id: 'auth',           label: '// Authentication'   },
  { id: 'scan',           label: '// POST /scan'        },
  { id: 'report',         label: '// GET /report/{id}'  },
  { id: 'fleet',          label: '// Fleet Endpoints'   },
  { id: 'webhooks',       label: '// Webhooks'          },
  { id: 'errors',         label: '// Error Codes'       },
]

function copyCode(id, text) {
  navigator.clipboard?.writeText(text)
  copied.value = id
  setTimeout(() => { copied.value = '' }, 1800)
}

const baseUrl = 'https://api.mechai.io/v1'

const snippets = {
  auth_header: `curl ${baseUrl}/scan \\\n  -H "Authorization: Bearer mech_live_k7x9n2q..."`,

  curl_scan: `curl -X POST ${baseUrl}/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "images=@front.jpg" \\
  -F "images=@rear.jpg" \\
  -F "vin=4T1B11HKXKU500284"`,

  js_scan: `const FormData = require('form-data')
const fs = require('fs')

const form = new FormData()
form.append('images', fs.createReadStream('front.jpg'))
form.append('images', fs.createReadStream('rear.jpg'))
form.append('vin', '4T1B11HKXKU500284')

const res = await fetch('${baseUrl}/scan', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: form,
})
const { scan_id } = await res.json()
// Scan takes 2–6s. Poll or use webhooks.`,

  scan_response: `{
  "scan_id": "scn_9xK2pR7mNq",
  "status": "processing",
  "estimated_completion_ms": 3200,
  "webhook_url": null
}`,

  report_response: `{
  "scan_id": "scn_9xK2pR7mNq",
  "status": "complete",
  "created_at": "2025-04-09T10:22:14Z",
  "vehicle": {
    "vin": "4T1B11HKXKU500284",
    "year": 2019, "make": "Toyota", "model": "Camry XLE"
  },
  "health_score": 72,
  "market_value": { "low": 14800, "mid": 16200, "high": 17600 },
  "repair_estimate": { "low": 1200, "high": 1800 },
  "defects": [
    {
      "id": "def_01",
      "category": "rust",
      "title": "Rust — Left Rear Wheel Arch",
      "severity": "critical",
      "location": "left_rear",
      "confidence": 0.97,
      "repair_cost": { "low": 340, "high": 520 }
    }
  ],
  "pdf_url": "https://reports.mechai.io/scn_9xK2pR7mNq.pdf"
}`,

  webhook_payload: `{
  "event": "scan.complete",
  "scan_id": "scn_9xK2pR7mNq",
  "health_score": 72,
  "defect_count": 7,
  "report_url": "https://reports.mechai.io/scn_9xK2pR7mNq.pdf",
  "timestamp": "2025-04-09T10:22:17Z"
}`,
}

const endpoints = [
  { method:'POST',   path:'/scan',               badge:'info',    desc:'Submit images for AI inspection'        },
  { method:'GET',    path:'/report/{scan_id}',    badge:'ok',      desc:'Retrieve completed inspection report'   },
  { method:'GET',    path:'/fleet',               badge:'ok',      desc:'List all vehicles in fleet'             },
  { method:'POST',   path:'/fleet',               badge:'info',    desc:'Add vehicle to fleet'                   },
  { method:'DELETE', path:'/fleet/{vehicle_id}',  badge:'crit',    desc:'Remove vehicle from fleet'              },
  { method:'GET',    path:'/scans',               badge:'ok',      desc:'List all scans with pagination'         },
  { method:'POST',   path:'/webhooks',            badge:'info',    desc:'Register webhook endpoint'              },
  { method:'DELETE', path:'/webhooks/{id}',       badge:'crit',    desc:'Delete webhook subscription'           },
]

const methodColor = {
  GET:    'text-health  border-health/30',
  POST:   'text-cyan    border-cyan/30',
  DELETE: 'text-hot-red border-hot-red/30',
  PATCH:  'text-amber-w border-amber-w/30',
}

const errorCodes = [
  { code:400, label:'BAD_REQUEST',          desc:'Missing required fields or invalid image format'         },
  { code:401, label:'UNAUTHORIZED',         desc:'API key missing, expired, or revoked'                    },
  { code:402, label:'SCAN_LIMIT_EXCEEDED',  desc:'Monthly scan quota reached. Upgrade your plan.'          },
  { code:404, label:'NOT_FOUND',            desc:'Scan ID or resource does not exist'                      },
  { code:413, label:'PAYLOAD_TOO_LARGE',    desc:'Image exceeds 20MB limit'                                },
  { code:422, label:'PROCESSING_FAILED',    desc:'AI could not process image. Check resolution and angle.' },
  { code:429, label:'RATE_LIMITED',         desc:'Too many requests. Current limit: 1,000 req/min'         },
  { code:500, label:'INTERNAL_ERROR',       desc:'Something went wrong on our end. Retry after 30s.'       },
]
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep">

    <!-- Header -->
    <div class="relative bg-bg-dark border-b border-orange/18 px-6 lg:px-[60px] py-8 overflow-hidden">
      <div class="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
      <div class="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div class="font-mono-tech text-[10px] tracking-[.28em] uppercase text-cyan mb-1">
            // MechAI REST API · v1
          </div>
          <h1 class="font-rye text-cream" style="font-size: clamp(26px, 4vw, 46px)">
            API <span class="text-orange">Reference</span>
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <MechBadge variant="ok">v1 Stable</MechBadge>
          <span class="font-mono-tech text-[10px] text-tan">Base URL:</span>
          <code class="font-mono-tech text-[11px] text-cyan bg-bg-card px-3 py-1">{{ baseUrl }}</code>
        </div>
      </div>
    </div>

    <div class="px-6 lg:px-[60px] py-10 max-w-[1300px] mx-auto">
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- Sidebar Nav -->
        <nav class="lg:w-52 flex-shrink-0 flex flex-row lg:flex-col gap-1
                    overflow-x-auto pb-2 lg:pb-0 lg:sticky lg:top-20 lg:self-start">
          <button
            v-for="s in sections" :key="s.id"
            class="font-mono-tech text-[10px] tracking-[.13em] uppercase px-4 py-2.5
                   text-left whitespace-nowrap border transition-all cursor-pointer bg-transparent"
            :class="activeSection === s.id
              ? 'border-orange bg-orange/12 text-cream'
              : 'border-transparent text-tan hover:text-cream-dim hover:border-white/12'"
            @click="activeSection = s.id"
          >{{ s.label }}</button>
        </nav>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <Transition name="fade" mode="out-in">

            <!-- ── OVERVIEW ── -->
            <div v-if="activeSection === 'overview'" key="overview" class="flex flex-col gap-6">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-4">
                  // About the API
                </div>
                <p class="font-barlow-body text-[15px] text-cream-dim leading-[1.7] mb-4">
                  The MechAI REST API gives you programmatic access to our AI-powered vehicle inspection engine.
                  Upload photos and receive a structured defect report, health score, and repair estimate in seconds.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div v-for="stat in [
                    { n:'&lt; 4s',    l:'Avg response time' },
                    { n:'99.9%',  l:'API uptime SLA'    },
                    { n:'200+',   l:'Defect categories' },
                  ]" :key="stat.l"
                  class="bg-bg-card2 border border-orange/18 p-4 text-center">
                    <div class="font-rye text-2xl text-orange" v-html="stat.n" />
                    <div class="font-mono-tech text-[8px] uppercase tracking-[.15em] text-tan mt-1">{{ stat.l }}</div>
                  </div>
                </div>
              </MechCard>

              <!-- Endpoints overview -->
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-5">
                  // All Endpoints
                </div>
                <div class="flex flex-col gap-2">
                  <div v-for="ep in endpoints" :key="ep.path"
                       class="flex items-center gap-3 py-2.5 border-b border-white/5 hover:bg-white/2 transition-colors px-1">
                    <span class="font-mono-tech text-[10px] font-bold border px-2 py-0.5 w-16 text-center flex-shrink-0"
                          :class="methodColor[ep.method]">{{ ep.method }}</span>
                    <code class="font-mono-tech text-[11px] text-cream flex-1">{{ ep.path }}</code>
                    <span class="font-barlow-body text-xs text-cream-dim hidden sm:block">{{ ep.desc }}</span>
                  </div>
                </div>
              </MechCard>
            </div>

            <!-- ── AUTH ── -->
            <div v-else-if="activeSection === 'auth'" key="auth" class="flex flex-col gap-6">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-4">
                  // Bearer Token Authentication
                </div>
                <p class="font-barlow-body text-[14px] text-cream-dim leading-[1.65] mb-5">
                  All API requests require a <code class="text-cyan font-mono-tech text-[12px]">Bearer</code> token
                  in the <code class="text-cyan font-mono-tech text-[12px]">Authorization</code> header.
                  Generate API keys from your <RouterLink to="/settings" class="text-orange hover:text-amber-w">Settings → API Keys</RouterLink> page.
                </p>
                <CodeBlock
                  id="auth_header"
                  :code="snippets.auth_header"
                  :copied="copied"
                  @copy="copyCode"
                />
                <div class="mt-5 bg-amber-w/8 border border-amber-w/30 p-4 flex gap-3">
                  <span class="text-amber-w font-mono-tech text-sm flex-shrink-0">⚠</span>
                  <p class="font-barlow-body text-sm text-cream-dim">
                    Never expose API keys client-side. Always proxy requests through your backend server.
                  </p>
                </div>
              </MechCard>
            </div>

            <!-- ── POST /SCAN ── -->
            <div v-else-if="activeSection === 'scan'" key="scan" class="flex flex-col gap-6">
              <MechCard padding="p-6">
                <div class="flex items-center gap-3 mb-5">
                  <span class="font-mono-tech text-[11px] border border-cyan/30 text-cyan px-2 py-0.5">POST</span>
                  <code class="font-mono-tech text-[13px] text-cream">/scan</code>
                  <MechBadge variant="info" small>multipart/form-data</MechBadge>
                </div>
                <p class="font-barlow-body text-[14px] text-cream-dim leading-[1.65] mb-5">
                  Submit 1–8 vehicle images for AI analysis. Returns a <code class="text-cyan text-[12px] font-mono-tech">scan_id</code> immediately.
                  Poll <code class="text-cyan text-[12px] font-mono-tech">GET /report/{scan_id}</code> or use webhooks to receive results.
                </p>

                <!-- Parameters table -->
                <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-3">Parameters</div>
                <table class="w-full border-collapse mb-5 text-sm">
                  <thead>
                    <tr class="border-b border-orange/18">
                      <th class="font-mono-tech text-[8px] text-tan text-left pb-2 pr-4">FIELD</th>
                      <th class="font-mono-tech text-[8px] text-tan text-left pb-2 pr-4">TYPE</th>
                      <th class="font-mono-tech text-[8px] text-tan text-left pb-2 pr-4">REQ</th>
                      <th class="font-mono-tech text-[8px] text-tan text-left pb-2">DESCRIPTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="p in [
                      { f:'images',       t:'File[]',  r:true,  d:'1–8 images. JPG/PNG/WEBP. Max 20MB each.'  },
                      { f:'vin',          t:'string',  r:false, d:'17-char VIN for history cross-reference.'  },
                      { f:'webhook_url',  t:'string',  r:false, d:'HTTPS URL to POST results when ready.'     },
                      { f:'priority',     t:'boolean', r:false, d:'Fast-lane processing (Marshal+ plans).'    },
                    ]" :key="p.f"
                    class="border-b border-white/5">
                      <td class="font-mono-tech text-[11px] text-cyan py-2.5 pr-4">{{ p.f }}</td>
                      <td class="font-mono-tech text-[10px] text-amber-w py-2.5 pr-4">{{ p.t }}</td>
                      <td class="py-2.5 pr-4">
                        <span class="font-mono-tech text-[8px]" :class="p.r ? 'text-hot-red' : 'text-tan'">
                          {{ p.r ? 'required' : 'optional' }}
                        </span>
                      </td>
                      <td class="font-barlow-body text-[13px] text-cream-dim py-2.5">{{ p.d }}</td>
                    </tr>
                  </tbody>
                </table>

                <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-3">cURL Example</div>
                <CodeBlock id="curl_scan" :code="snippets.curl_scan" :copied="copied" @copy="copyCode" />

                <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-3 mt-5">JavaScript</div>
                <CodeBlock id="js_scan" :code="snippets.js_scan" :copied="copied" @copy="copyCode" />

                <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-3 mt-5">Response</div>
                <CodeBlock id="scan_response" :code="snippets.scan_response" :copied="copied" @copy="copyCode" />
              </MechCard>
            </div>

            <!-- ── GET /REPORT ── -->
            <div v-else-if="activeSection === 'report'" key="report" class="flex flex-col gap-6">
              <MechCard padding="p-6">
                <div class="flex items-center gap-3 mb-5">
                  <span class="font-mono-tech text-[11px] border border-health/30 text-health px-2 py-0.5">GET</span>
                  <code class="font-mono-tech text-[13px] text-cream">/report/{scan_id}</code>
                </div>
                <p class="font-barlow-body text-[14px] text-cream-dim leading-[1.65] mb-5">
                  Returns the full inspection report once processing is complete. Poll every 1–2 seconds
                  until <code class="text-cyan text-[12px] font-mono-tech">status === "complete"</code>.
                </p>

                <!-- Status values -->
                <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-3">Status Values</div>
                <div class="flex flex-wrap gap-2 mb-5">
                  <span v-for="s in ['processing','complete','failed']" :key="s"
                        class="font-mono-tech text-[10px] px-3 py-1 border"
                        :class="{
                          'border-amber-w/40 text-amber-w': s === 'processing',
                          'border-health/40 text-health':   s === 'complete',
                          'border-hot-red/40 text-hot-red': s === 'failed',
                        }">{{ s }}</span>
                </div>

                <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-3">Response</div>
                <CodeBlock id="report_response" :code="snippets.report_response" :copied="copied" @copy="copyCode" />
              </MechCard>
            </div>

            <!-- ── WEBHOOKS ── -->
            <div v-else-if="activeSection === 'webhooks'" key="webhooks" class="flex flex-col gap-6">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-4">
                  // Webhook Events
                </div>
                <p class="font-barlow-body text-[14px] text-cream-dim leading-[1.65] mb-5">
                  Register a HTTPS endpoint to receive real-time scan results without polling.
                  MechAI signs every payload with <code class="text-cyan text-[12px] font-mono-tech">X-MechAI-Signature</code>
                  (HMAC-SHA256) for verification.
                </p>

                <div class="flex flex-col gap-3 mb-5">
                  <div v-for="evt in [
                    { name:'scan.complete',  desc:'Fired when AI analysis finishes successfully'                },
                    { name:'scan.failed',    desc:'Fired when processing fails after 3 retries'                },
                    { name:'defect.critical',desc:'Fired when a critical severity defect is detected'          },
                    { name:'fleet.alert',    desc:'Fired when a fleet vehicle score drops below threshold'     },
                  ]" :key="evt.name"
                  class="flex items-start gap-3 border-b border-white/5 pb-3">
                    <code class="font-mono-tech text-[11px] text-cyan flex-shrink-0 w-40">{{ evt.name }}</code>
                    <span class="font-barlow-body text-[13px] text-cream-dim">{{ evt.desc }}</span>
                  </div>
                </div>

                <div class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-cyan mb-3">Payload</div>
                <CodeBlock id="webhook_payload" :code="snippets.webhook_payload" :copied="copied" @copy="copyCode" />
              </MechCard>
            </div>

            <!-- ── ERRORS ── -->
            <div v-else-if="activeSection === 'errors'" key="errors" class="flex flex-col gap-4">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-5">
                  // HTTP Error Codes
                </div>
                <div class="flex flex-col gap-0 divide-y divide-white/5">
                  <div v-for="e in errorCodes" :key="e.code"
                       class="flex items-start gap-4 py-3.5 hover:bg-white/2 transition-colors">
                    <span class="font-mono-tech text-[14px] font-bold w-12 flex-shrink-0"
                          :class="e.code >= 500 ? 'text-hot-red' : e.code >= 400 ? 'text-amber-w' : 'text-health'">
                      {{ e.code }}
                    </span>
                    <div>
                      <p class="font-mono-tech text-[11px] text-cyan">{{ e.label }}</p>
                      <p class="font-barlow-body text-[13px] text-cream-dim mt-0.5">{{ e.desc }}</p>
                    </div>
                  </div>
                </div>
              </MechCard>
            </div>

            <!-- ── FLEET ── -->
            <div v-else-if="activeSection === 'fleet'" key="fleet" class="flex flex-col gap-6">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-4">
                  // Fleet Management Endpoints
                </div>
                <div class="flex flex-col gap-4">
                  <div v-for="ep in endpoints.filter(e => e.path.includes('fleet'))" :key="ep.path"
                       class="border border-white/8 p-4 hover:border-orange/28 transition-colors">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="font-mono-tech text-[10px] font-bold border px-2 py-0.5"
                            :class="methodColor[ep.method]">{{ ep.method }}</span>
                      <code class="font-mono-tech text-[12px] text-cream">{{ ep.path }}</code>
                    </div>
                    <p class="font-barlow-body text-[13px] text-cream-dim">{{ ep.desc }}</p>
                  </div>
                </div>
              </MechCard>
            </div>

          </Transition>
        </div>
      </div>
    </div>
  </main>
</template>

<!-- Inline CodeBlock component -->
<script>
// We use defineComponent inline here to avoid an extra file
import { defineComponent, h } from 'vue'
const CodeBlock = defineComponent({
  props: { id: String, code: String, copied: String },
  emits: ['copy'],
  setup(props, { emit }) {
    return () => h('div', { class: 'relative' }, [
      h('pre', {
        class: 'bg-bg-deep border border-white/10 p-4 overflow-x-auto font-mono-tech text-[11px] text-cream-dim leading-[1.75] rounded-none'
      }, props.code),
      h('button', {
        class: `absolute top-2.5 right-2.5 font-mono-tech text-[8px] tracking-[.15em] uppercase px-2.5 py-1 border cursor-pointer bg-transparent transition-all ${
          props.copied === props.id
            ? 'border-health text-health'
            : 'border-white/15 text-tan hover:border-orange/40 hover:text-cream'
        }`,
        onClick: () => emit('copy', props.id, props.code),
      }, props.copied === props.id ? '✓ Copied' : 'Copy'),
    ])
  },
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
pre { tab-size: 2; }
</style>
