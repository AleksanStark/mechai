<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore }  from '../stores/auth.js'
import { useNotifStore } from '../stores/notif.js'
import MechCard  from '../components/ui/MechCard.vue'
import MechBadge from '../components/ui/MechBadge.vue'

const auth  = useAuthStore()
const notif = useNotifStore()

const activeTab = ref('profile')
const tabs = [
  { id: 'profile',  label: '// Profile'       },
  { id: 'plan',     label: '// Plan & Usage'  },
  { id: 'notifs',   label: '// Notifications' },
  { id: 'api',      label: '// API Keys'      },
  { id: 'danger',   label: '// Danger Zone'   },
]

// ── Profile form ─────────────────────────────────────
const profile = reactive({
  name:    auth.user?.name  || '',
  email:   auth.user?.email || '',
  company: auth.user?.company || '',
  phone:   auth.user?.phone || '',
  region:  auth.user?.region || 'us-west',
})
const savingProfile = ref(false)

async function saveProfile() {
  savingProfile.value = true
  await auth.updateProfile(profile)
  await delay(400)
  savingProfile.value = false
  notif.ok('Profile saved', 'Your changes have been applied')
}

// ── Plan ─────────────────────────────────────────────
const PLANS = [
  { id: 'scout',   label: 'Scout',   price: 29,  scans: 50,        color: 'neutral' },
  { id: 'marshal', label: 'Marshal', price: 99,  scans: 500,       color: 'info'    },
  { id: 'sheriff', label: 'Sheriff', price: 349, scans: Infinity,  color: 'warn'    },
]
const currentPlan  = computed(() => PLANS.find(p => p.id === auth.plan) || PLANS[0])
const scansUsed    = computed(() => auth.user?.scansUsed  || 0)
const scansLimit   = computed(() => auth.user?.scansLimit || 50)
const scanPct      = computed(() => Math.min((scansUsed.value / scansLimit.value) * 100, 100))

function upgrade(planId) {
  notif.info('Redirecting to checkout…', `Upgrading to ${planId} plan`)
}

// ── Notifications ─────────────────────────────────────
const notifPrefs = reactive({
  scanComplete:  true,
  criticalAlert: true,
  weeklyReport:  false,
  marketUpdates: true,
  newsletter:    false,
})

async function saveNotifPrefs() {
  await delay(500)
  notif.ok('Notification prefs saved', 'Changes will apply on next scan')
}

// ── API Keys ──────────────────────────────────────────
const apiKeys = ref([
  { id: 'key_1', name: 'Production',  key: 'mech_live_k7x9n2q...', created: 'Mar 12, 2025', lastUsed: '2h ago',  active: true  },
  { id: 'key_2', name: 'Development', key: 'mech_live_p3m8r1z...', created: 'Feb 28, 2025', lastUsed: '5d ago',  active: true  },
  { id: 'key_3', name: 'Staging',     key: 'mech_live_v6w4t9s...', created: 'Jan 05, 2025', lastUsed: 'Never',   active: false },
])
const newKeyName  = ref('')
const creatingKey = ref(false)
const revealIdx   = ref(-1)

async function createKey() {
  if (!newKeyName.value.trim()) return
  creatingKey.value = true
  await delay(800)
  apiKeys.value.unshift({
    id: 'key_' + Date.now(),
    name: newKeyName.value,
    key: 'mech_live_' + Math.random().toString(36).slice(2, 10) + '...',
    created: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    lastUsed: 'Never',
    active: true,
  })
  newKeyName.value  = ''
  creatingKey.value = false
  notif.ok('API key created', 'Store it safely — it won\'t be shown again')
}

function revokeKey(id) {
  apiKeys.value = apiKeys.value.filter(k => k.id !== id)
  notif.warn('Key revoked', 'Any integrations using this key will stop working')
}

function copyKey(key) {
  navigator.clipboard?.writeText(key.replace('...', 'FULL_KEY_HIDDEN'))
  notif.ok('Copied', 'API key copied to clipboard')
}

// ── Danger ────────────────────────────────────────────
const deleteConfirm = ref('')
const deleting      = ref(false)

async function deleteAccount() {
  if (deleteConfirm.value !== 'DELETE') return
  deleting.value = true
  await delay(1200)
  auth.logout()
  notif.error('Account deleted', 'Your data has been permanently removed')
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep">

    <!-- Page Header -->
    <div class="relative bg-bg-dark border-b border-orange/18 px-6 lg:px-[60px] py-8 overflow-hidden">
      <div class="absolute inset-0 grid-overlay opacity-25 pointer-events-none" />
      <div class="relative z-10 flex items-center gap-4">
        <!-- Avatar -->
        <div class="w-12 h-12 rounded-full border-2 border-orange/40 bg-bg-card2
                    flex items-center justify-center font-rye text-xl text-orange flex-shrink-0">
          {{ auth.initials }}
        </div>
        <div>
          <div class="font-mono-tech text-[10px] tracking-[.25em] uppercase text-cyan mb-0.5">
            // Account Settings
          </div>
          <h1 class="font-rye text-cream" style="font-size: clamp(22px, 3vw, 36px)">
            {{ auth.displayName }}
          </h1>
        </div>
        <MechBadge class="ml-auto" :variant="currentPlan.color">{{ currentPlan.label }}</MechBadge>
      </div>
    </div>

    <div class="px-6 lg:px-[60px] py-10 max-w-[1100px] mx-auto">
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- Tab Nav -->
        <nav class="lg:w-52 flex-shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          <button
            v-for="t in tabs"
            :key="t.id"
            class="font-mono-tech text-[10px] tracking-[.14em] uppercase px-4 py-2.5
                   text-left whitespace-nowrap border transition-all cursor-pointer bg-transparent"
            :class="activeTab === t.id
              ? 'border-orange bg-orange/12 text-cream'
              : 'border-transparent text-tan hover:text-cream-dim hover:border-white/12'"
            :style="t.id === 'danger' && activeTab !== 'danger' ? 'color: var(--color-hot-red); opacity:.6' : ''"
            @click="activeTab = t.id"
          >{{ t.label }}</button>
        </nav>

        <!-- Tab Content -->
        <div class="flex-1 min-w-0">
          <Transition name="fade" mode="out-in">

            <!-- ── PROFILE ── -->
            <div v-if="activeTab === 'profile'" key="profile" class="flex flex-col gap-5">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-6">
                  // Personal Information
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-for="field in [
                    { key:'name',    label:'Full Name',    type:'text',  placeholder:'Jesse Hawkins'        },
                    { key:'email',   label:'Email',        type:'email', placeholder:'you@company.com'      },
                    { key:'company', label:'Company',      type:'text',  placeholder:'AtlasDev Inc.'        },
                    { key:'phone',   label:'Phone',        type:'tel',   placeholder:'+1 (555) 000-0000'   },
                  ]" :key="field.key" class="flex flex-col gap-1.5">
                    <label class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-tan">
                      {{ field.label }}
                    </label>
                    <input
                      v-model="profile[field.key]"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      class="bg-bg-card2 border border-orange/25 px-4 py-2.5
                             font-barlow-body text-[14px] text-cream placeholder-tan/40
                             focus:outline-none focus:border-orange transition-colors"
                    />
                  </div>

                  <!-- Region -->
                  <div class="flex flex-col gap-1.5">
                    <label class="font-mono-tech text-[9px] tracking-[.18em] uppercase text-tan">
                      Region
                    </label>
                    <select
                      v-model="profile.region"
                      class="bg-bg-card2 border border-orange/25 px-4 py-2.5
                             font-barlow-body text-[14px] text-cream
                             focus:outline-none focus:border-orange transition-colors cursor-pointer"
                    >
                      <option value="us-west">US — West</option>
                      <option value="us-east">US — East</option>
                      <option value="eu-west">Europe — West</option>
                      <option value="ap-se">Asia Pacific</option>
                      <option value="kr">South Korea</option>
                    </select>
                  </div>
                </div>

                <div class="flex justify-end mt-6">
                  <button
                    class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
                           px-7 py-3 clip-btn transition-all cursor-pointer border-0"
                    :class="savingProfile
                      ? 'bg-orange/50 text-bg-deep/60'
                      : 'bg-orange text-bg-deep hover:bg-amber-w'"
                    :disabled="savingProfile"
                    @click="saveProfile"
                  >{{ savingProfile ? 'Saving…' : '⬡ Save Profile' }}</button>
                </div>
              </MechCard>

              <!-- Change password card -->
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-5">
                  // Change Password
                </div>
                <div class="flex flex-col gap-3 max-w-sm">
                  <input type="password" placeholder="Current password"
                         class="bg-bg-card2 border border-orange/25 px-4 py-2.5 font-barlow-body
                                text-[14px] text-cream placeholder-tan/40 focus:outline-none focus:border-orange"/>
                  <input type="password" placeholder="New password"
                         class="bg-bg-card2 border border-orange/25 px-4 py-2.5 font-barlow-body
                                text-[14px] text-cream placeholder-tan/40 focus:outline-none focus:border-orange"/>
                  <input type="password" placeholder="Confirm new password"
                         class="bg-bg-card2 border border-orange/25 px-4 py-2.5 font-barlow-body
                                text-[14px] text-cream placeholder-tan/40 focus:outline-none focus:border-orange"/>
                  <button
                    class="font-mono-tech text-[11px] tracking-[.15em] uppercase px-6 py-3 clip-btn
                           bg-transparent border border-cyan-dim text-cyan hover:bg-cyan/10
                           transition-colors cursor-pointer self-start"
                    @click="notif.ok('Password updated', 'Your new password is active')"
                  >Update Password</button>
                </div>
              </MechCard>
            </div>

            <!-- ── PLAN ── -->
            <div v-else-if="activeTab === 'plan'" key="plan" class="flex flex-col gap-5">
              <!-- Usage card -->
              <MechCard padding="p-6" :hot="true">
                <div class="flex items-center justify-between mb-5">
                  <div>
                    <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-1">
                      // Current Plan
                    </div>
                    <div class="font-rye text-2xl text-orange">{{ currentPlan.label }}</div>
                  </div>
                  <div class="font-rye text-4xl text-cream">
                    <sup class="font-barlow-cond text-lg align-super">$</sup>{{ currentPlan.price }}
                    <span class="font-barlow-body text-sm text-tan">/mo</span>
                  </div>
                </div>

                <div class="mb-2 flex justify-between">
                  <span class="font-mono-tech text-[9px] tracking-[.14em] text-tan">
                    SCANS USED THIS MONTH
                  </span>
                  <span class="font-mono-tech text-[10px] text-cream">
                    {{ scansUsed }} / {{ scansLimit === Infinity ? '∞' : scansLimit }}
                  </span>
                </div>
                <div class="h-2 bg-white/8 relative overflow-hidden">
                  <div
                    class="absolute top-0 left-0 h-full transition-all duration-700"
                    :class="scanPct > 85 ? 'bg-hot-red' : scanPct > 60 ? 'bg-amber-w' : 'bg-health'"
                    :style="{ width: scanPct + '%' }"
                  />
                </div>
                <p v-if="scanPct > 80" class="font-mono-tech text-[9px] text-amber-w mt-2">
                  ⚠ Approaching scan limit — consider upgrading
                </p>
              </MechCard>

              <!-- Plan comparison -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div
                  v-for="plan in PLANS"
                  :key="plan.id"
                  class="border p-5 transition-all"
                  :class="plan.id === auth.plan
                    ? 'border-orange bg-orange/8'
                    : 'border-white/10 bg-bg-card hover:border-orange/35'"
                >
                  <div class="font-mono-tech text-[9px] uppercase tracking-[.18em] text-tan mb-2">
                    {{ plan.label }}
                    <span v-if="plan.id === auth.plan" class="text-orange ml-1">← CURRENT</span>
                  </div>
                  <div class="font-rye text-3xl text-cream mb-4">
                    <sup class="font-barlow-cond text-base align-super">$</sup>{{ plan.price }}
                    <span class="font-barlow-body text-xs text-tan">/mo</span>
                  </div>
                  <div class="font-barlow-body text-sm text-cream-dim mb-4">
                    {{ plan.scans === Infinity ? 'Unlimited' : plan.scans }} scans/month
                  </div>
                  <button
                    v-if="plan.id !== auth.plan"
                    class="font-mono-tech text-[9px] tracking-[.14em] uppercase w-full py-2
                           clip-btn border border-orange/40 text-orange hover:bg-orange hover:text-bg-deep
                           transition-all cursor-pointer bg-transparent"
                    @click="upgrade(plan.label)"
                  >Switch Plan</button>
                  <div v-else class="font-mono-tech text-[9px] text-orange text-center py-2">
                    ACTIVE
                  </div>
                </div>
              </div>
            </div>

            <!-- ── NOTIFICATIONS ── -->
            <div v-else-if="activeTab === 'notifs'" key="notifs" class="flex flex-col gap-4">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-6">
                  // Notification Preferences
                </div>
                <div class="flex flex-col gap-0 divide-y divide-white/5">
                  <label
                    v-for="(row, key) in {
                      scanComplete:  { label:'Scan Complete',    desc:'Notify when an AI inspection finishes'          },
                      criticalAlert: { label:'Critical Alerts',  desc:'Immediate alerts for critical defects found'    },
                      weeklyReport:  { label:'Weekly Summary',   desc:'Fleet health digest every Monday morning'       },
                      marketUpdates: { label:'Market Updates',   desc:'Price alerts when vehicle values shift >5%'     },
                      newsletter:    { label:'Product News',     desc:'MechAI feature launches and tips'               },
                    }"
                    :key="key"
                    class="flex items-center justify-between py-4 cursor-pointer"
                  >
                    <div>
                      <p class="font-barlow-cond text-cream text-[15px] font-semibold">{{ row.label }}</p>
                      <p class="font-barlow-body text-sm text-cream-dim">{{ row.desc }}</p>
                    </div>
                    <div
                      class="relative w-10 h-5.5 rounded-full transition-colors duration-300 flex-shrink-0 ml-4"
                      :class="notifPrefs[key] ? 'bg-orange' : 'bg-white/15'"
                      @click.prevent="notifPrefs[key] = !notifPrefs[key]"
                    >
                      <div
                        class="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform duration-300"
                        :class="notifPrefs[key] ? 'translate-x-5' : 'translate-x-0.5'"
                        style="width:18px;height:18px;top:2px"
                      />
                    </div>
                  </label>
                </div>
                <div class="flex justify-end mt-4">
                  <button
                    class="font-mono-tech text-[11px] tracking-[.15em] uppercase font-bold
                           px-7 py-3 clip-btn bg-orange text-bg-deep hover:bg-amber-w
                           transition-colors cursor-pointer border-0"
                    @click="saveNotifPrefs"
                  >⬡ Save Preferences</button>
                </div>
              </MechCard>
            </div>

            <!-- ── API KEYS ── -->
            <div v-else-if="activeTab === 'api'" key="api" class="flex flex-col gap-5">
              <!-- Create new key -->
              <MechCard padding="p-5">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-4">
                  // Create New Key
                </div>
                <div class="flex gap-3">
                  <input
                    v-model="newKeyName"
                    placeholder="Key name (e.g. Production)"
                    class="flex-1 bg-bg-card2 border border-orange/25 px-4 py-2.5
                           font-barlow-body text-[14px] text-cream placeholder-tan/40
                           focus:outline-none focus:border-orange transition-colors"
                    @keydown.enter="createKey"
                  />
                  <button
                    class="font-mono-tech text-[11px] tracking-[.14em] uppercase font-bold
                           px-6 py-2.5 clip-btn border-0 transition-all cursor-pointer flex-shrink-0"
                    :class="creatingKey ? 'bg-orange/50 text-bg-deep/60' : 'bg-orange text-bg-deep hover:bg-amber-w'"
                    :disabled="creatingKey"
                    @click="createKey"
                  >{{ creatingKey ? '…' : '+ Generate' }}</button>
                </div>
              </MechCard>

              <!-- Keys list -->
              <MechCard padding="p-5">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-cyan mb-5">
                  // Active Keys — {{ apiKeys.length }}
                </div>
                <div class="flex flex-col gap-3">
                  <div
                    v-for="(k, i) in apiKeys"
                    :key="k.id"
                    class="border border-white/8 p-4 flex flex-col sm:flex-row sm:items-center
                           justify-between gap-3 hover:border-orange/25 transition-colors"
                  >
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <p class="font-barlow-cond text-cream font-semibold text-[14px]">{{ k.name }}</p>
                        <MechBadge :variant="k.active ? 'ok' : 'neutral'" small>
                          {{ k.active ? 'Active' : 'Inactive' }}
                        </MechBadge>
                      </div>
                      <div class="font-mono-tech text-[10px] text-tan flex flex-wrap gap-x-4">
                        <span>{{ revealIdx === i ? k.key.replace('...', 'sk_FULL_KEY_DEMO') : k.key }}</span>
                        <span>Created {{ k.created }}</span>
                        <span>Last used: {{ k.lastUsed }}</span>
                      </div>
                    </div>
                    <div class="flex gap-2 flex-shrink-0">
                      <button
                        class="font-mono-tech text-[9px] tracking-[.1em] uppercase px-3 py-1.5
                               border border-white/15 text-tan hover:text-cream hover:border-orange/40
                               transition-colors cursor-pointer bg-transparent"
                        @click="revealIdx = revealIdx === i ? -1 : i"
                      >{{ revealIdx === i ? 'Hide' : 'Reveal' }}</button>
                      <button
                        class="font-mono-tech text-[9px] tracking-[.1em] uppercase px-3 py-1.5
                               border border-cyan/30 text-cyan hover:bg-cyan/10
                               transition-colors cursor-pointer bg-transparent"
                        @click="copyKey(k)"
                      >Copy</button>
                      <button
                        class="font-mono-tech text-[9px] tracking-[.1em] uppercase px-3 py-1.5
                               border border-hot-red/30 text-hot-red hover:bg-hot-red/10
                               transition-colors cursor-pointer bg-transparent"
                        @click="revokeKey(k.id)"
                      >Revoke</button>
                    </div>
                  </div>
                </div>
              </MechCard>

              <!-- Docs callout -->
              <div class="font-mono-tech text-[10px] text-tan tracking-[.1em] px-1">
                Full API reference at
                <a href="#" class="text-cyan hover:text-cream transition-colors">docs.mechai.io/api</a>
                · Rate limit: 1,000 req/min on Marshal plan
              </div>
            </div>

            <!-- ── DANGER ZONE ── -->
            <div v-else-if="activeTab === 'danger'" key="danger" class="flex flex-col gap-4">
              <MechCard padding="p-6">
                <div class="font-mono-tech text-[9px] tracking-[.22em] uppercase text-hot-red mb-5 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 bg-hot-red rounded-full animate-pulse" />
                  // Danger Zone
                </div>

                <!-- Logout all devices -->
                <div class="flex items-center justify-between py-4 border-b border-white/8">
                  <div>
                    <p class="font-barlow-cond text-cream font-semibold">Sign Out All Devices</p>
                    <p class="font-barlow-body text-sm text-cream-dim">Revokes all active sessions immediately</p>
                  </div>
                  <button
                    class="font-mono-tech text-[10px] tracking-[.12em] uppercase px-5 py-2.5
                           border border-amber-w/40 text-amber-w hover:bg-amber-w/10
                           transition-colors cursor-pointer bg-transparent clip-btn flex-shrink-0"
                    @click="notif.warn('Signed out everywhere', 'All other sessions have been terminated')"
                  >Force Logout</button>
                </div>

                <!-- Export data -->
                <div class="flex items-center justify-between py-4 border-b border-white/8">
                  <div>
                    <p class="font-barlow-cond text-cream font-semibold">Export Your Data</p>
                    <p class="font-barlow-body text-sm text-cream-dim">Download all scans, reports, and account data as ZIP</p>
                  </div>
                  <button
                    class="font-mono-tech text-[10px] tracking-[.12em] uppercase px-5 py-2.5
                           border border-cyan/40 text-cyan hover:bg-cyan/10
                           transition-colors cursor-pointer bg-transparent clip-btn flex-shrink-0"
                    @click="notif.info('Export queued', 'Download link will be sent to your email')"
                  >Export ZIP</button>
                </div>

                <!-- Delete account -->
                <div class="pt-6">
                  <p class="font-barlow-cond text-hot-red font-semibold mb-1">Delete Account</p>
                  <p class="font-barlow-body text-sm text-cream-dim mb-4">
                    This permanently deletes your account, all vehicles, scans, and reports.
                    This action <strong class="text-hot-red">cannot be undone</strong>.
                  </p>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <input
                      v-model="deleteConfirm"
                      placeholder='Type "DELETE" to confirm'
                      class="flex-1 bg-bg-card2 border border-hot-red/30 px-4 py-2.5
                             font-mono-tech text-[12px] text-hot-red placeholder-hot-red/30
                             focus:outline-none focus:border-hot-red transition-colors"
                    />
                    <button
                      class="font-mono-tech text-[10px] tracking-[.12em] uppercase px-6 py-2.5
                             clip-btn border-0 transition-all flex-shrink-0"
                      :class="deleteConfirm === 'DELETE'
                        ? 'bg-hot-red text-white hover:bg-hot-red/80 cursor-pointer'
                        : 'bg-hot-red/20 text-hot-red/40 cursor-not-allowed'"
                      :disabled="deleteConfirm !== 'DELETE' || deleting"
                      @click="deleteAccount"
                    >{{ deleting ? 'Deleting…' : 'Delete Account' }}</button>
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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
</style>
