<script setup>
import { ref, reactive } from 'vue'
import { useRouter }      from 'vue-router'
import { useAuthStore }   from '../stores/auth'
import { useNotifStore }  from '../stores/notif'

const router = useRouter()
const auth   = useAuthStore()
const notif  = useNotifStore()

const tab     = ref('login')   // 'login' | 'register'
const loading = ref(false)
const showPwd = ref(false)

const form = reactive({ name: '', email: '', password: '', confirm: '', remember: false })
const errs = reactive({ name: '', email: '', password: '', confirm: '', general: '' })

function clearErrs() { Object.keys(errs).forEach(k => errs[k] = '') }

function validate() {
  clearErrs()
  let ok = true
  if (tab.value === 'register' && !form.name.trim()) { errs.name = 'Name is required'; ok = false }
  if (!form.email.includes('@'))  { errs.email    = 'Valid email required'; ok = false }
  if (form.password.length < 6)   { errs.password = 'Min 6 characters';    ok = false }
  if (tab.value === 'register' && form.password !== form.confirm) {
    errs.confirm = 'Passwords do not match'; ok = false
  }
  return ok
}

async function submit() {
  if (!validate() || loading.value) return
  loading.value = true
  clearErrs()
  try {
    if (tab.value === 'login') {
      await auth.login(form.email, form.password)
      notif.ok('Welcome back, Sheriff', `Logged in as ${form.email}`)
    } else {
      await auth.register(form.name, form.email, form.password)
      notif.ok('Account created', 'Your free Scout plan is ready')
    }
    router.push('/dashboard')
  } catch (e) {
    errs.general = e.message || 'Something went wrong'
    notif.error('Auth failed', errs.general)
  } finally {
    loading.value = false
  }
}

function switchTab(t) {
  tab.value = t
  clearErrs()
  form.name = form.password = form.confirm = ''
}
</script>

<template>
  <main class="min-h-screen pt-[62px] bg-bg-deep flex items-center justify-center px-4 py-16">

    <!-- Background grid -->
    <div class="fixed inset-0 grid-overlay opacity-30 pointer-events-none" />
    <!-- Desert glow -->
    <div class="fixed inset-0 pointer-events-none"
         style="background: radial-gradient(ellipse at 50% 100%, rgba(200,80,20,.1), transparent 60%)" />

    <div class="relative z-10 w-full max-w-[440px]">

      <!-- Logo mark -->
      <div class="text-center mb-10">
        <RouterLink to="/" class="inline-flex flex-col items-center gap-3 no-underline">
          <svg width="52" height="52" viewBox="0 0 34 34" fill="none">
            <rect x="5" y="18" width="24" height="4" rx="1" fill="#E8792A"/>
            <rect x="9" y="11" width="16" height="9" rx="1" fill="#B87840"/>
            <rect x="9" y="15" width="16" height="2" fill="#C46030" opacity=".8"/>
            <rect x="13" y="13" width="6" height="5" rx="1" fill="#3D5F7A"/>
            <circle cx="16" cy="15.5" r="2.5" fill="#FF2222"/>
            <circle cx="16" cy="15.5" r="1.2" fill="#FF6666"/>
            <rect x="19" y="15" width="10" height="1.5" fill="#FF3333" opacity=".8" rx=".5"/>
            <circle cx="29" cy="15.75" r="1" fill="#FF5555" opacity=".6"/>
          </svg>
          <span class="font-rye text-2xl text-cream">Mech<span class="text-orange">AI</span></span>
        </RouterLink>
      </div>

      <!-- Card -->
      <div class="relative bg-bg-card border border-orange/22 p-8">
        <!-- HUD corners -->
        <div class="absolute top-0 left-0  w-3.5 h-3.5 border-t-2 border-l-2 border-cyan" />
        <div class="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan" />
        <div class="absolute bottom-0 left-0  w-3.5 h-3.5 border-b-2 border-l-2 border-cyan" />
        <div class="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan" />

        <!-- Tabs -->
        <div class="flex mb-8 border-b border-white/10">
          <button
            v-for="t in ['login','register']"
            :key="t"
            class="flex-1 font-mono-tech text-[11px] tracking-[.18em] uppercase pb-3
                   transition-all cursor-pointer bg-transparent border-0 border-b-2 -mb-px"
            :class="tab === t
              ? 'text-orange border-orange'
              : 'text-tan border-transparent hover:text-cream-dim'"
            @click="switchTab(t)"
          >{{ t === 'login' ? '// Sign In' : '// Register' }}</button>
        </div>

        <!-- General error -->
        <Transition name="fade">
          <div v-if="errs.general"
               class="mb-5 flex items-center gap-2.5 px-4 py-3 bg-hot-red/10 border border-hot-red/40">
            <span class="text-hot-red font-mono-tech text-sm">✕</span>
            <p class="font-barlow-body text-sm text-hot-red">{{ errs.general }}</p>
          </div>
        </Transition>

        <!-- Form -->
        <form class="flex flex-col gap-5" @submit.prevent="submit">

          <!-- Name (register only) -->
          <Transition name="field">
            <div v-if="tab === 'register'" class="flex flex-col gap-1.5">
              <label class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-tan">
                Full Name
              </label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Jesse Hawkins"
                autocomplete="name"
                class="w-full bg-bg-card2 border px-4 py-3 font-barlow-body text-[14px] text-cream
                       placeholder-tan/40 focus:outline-none transition-colors"
                :class="errs.name ? 'border-hot-red' : 'border-orange/28 focus:border-orange'"
              />
              <span v-if="errs.name" class="font-mono-tech text-[9px] text-hot-red">{{ errs.name }}</span>
            </div>
          </Transition>

          <!-- Email -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-tan">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@mechcompany.com"
              autocomplete="email"
              class="w-full bg-bg-card2 border px-4 py-3 font-barlow-body text-[14px] text-cream
                     placeholder-tan/40 focus:outline-none transition-colors"
              :class="errs.email ? 'border-hot-red' : 'border-orange/28 focus:border-orange'"
            />
            <span v-if="errs.email" class="font-mono-tech text-[9px] text-hot-red">{{ errs.email }}</span>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-1.5">
            <label class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-tan">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPwd ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                class="w-full bg-bg-card2 border px-4 py-3 pr-12 font-barlow-body text-[14px] text-cream
                       placeholder-tan/40 focus:outline-none transition-colors"
                :class="errs.password ? 'border-hot-red' : 'border-orange/28 focus:border-orange'"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 font-mono-tech text-[10px]
                       text-tan hover:text-cream transition-colors cursor-pointer bg-transparent border-0"
                @click="showPwd = !showPwd"
              >{{ showPwd ? 'HIDE' : 'SHOW' }}</button>
            </div>
            <span v-if="errs.password" class="font-mono-tech text-[9px] text-hot-red">{{ errs.password }}</span>
          </div>

          <!-- Confirm (register only) -->
          <Transition name="field">
            <div v-if="tab === 'register'" class="flex flex-col gap-1.5">
              <label class="font-mono-tech text-[9px] tracking-[.2em] uppercase text-tan">
                Confirm Password
              </label>
              <input
                v-model="form.confirm"
                type="password"
                placeholder="••••••••"
                autocomplete="new-password"
                class="w-full bg-bg-card2 border px-4 py-3 font-barlow-body text-[14px] text-cream
                       placeholder-tan/40 focus:outline-none transition-colors"
                :class="errs.confirm ? 'border-hot-red' : 'border-orange/28 focus:border-orange'"
              />
              <span v-if="errs.confirm" class="font-mono-tech text-[9px] text-hot-red">{{ errs.confirm }}</span>
            </div>
          </Transition>

          <!-- Remember / Forgot -->
          <div v-if="tab === 'login'" class="flex justify-between items-center">
            <label class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-3.5 h-3.5 accent-orange cursor-pointer"
              />
              <span class="font-mono-tech text-[9px] text-tan tracking-[.12em] uppercase">Remember me</span>
            </label>
            <button type="button"
                    class="font-mono-tech text-[9px] text-cyan hover:text-cream transition-colors
                           bg-transparent border-0 cursor-pointer tracking-[.1em] uppercase">
              Forgot password?
            </button>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="font-mono-tech text-[13px] tracking-[.18em] uppercase font-bold
                   w-full py-4 clip-btn flex items-center justify-center gap-2.5
                   transition-all duration-200 border-0 mt-1"
            :class="loading
              ? 'bg-orange/50 text-bg-deep/60 cursor-not-allowed'
              : 'bg-orange text-bg-deep hover:bg-amber-w cursor-pointer'"
            :disabled="loading"
          >
            <svg v-if="loading" class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="40 20"/>
            </svg>
            <span>{{ loading ? 'Processing…' : (tab === 'login' ? '⬡ Enter MechAI' : '⬡ Create Account') }}</span>
          </button>
        </form>

        <!-- Social divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-white/8" />
          <span class="font-mono-tech text-[9px] text-tan tracking-[.15em]">OR</span>
          <div class="flex-1 h-px bg-white/8" />
        </div>

        <!-- OAuth buttons -->
        <div class="flex gap-2">
          <button
            v-for="provider in ['Google', 'GitHub']"
            :key="provider"
            class="flex-1 font-mono-tech text-[10px] tracking-[.12em] uppercase
                   py-3 border border-white/12 text-cream-dim
                   hover:border-orange/40 hover:text-cream transition-colors cursor-pointer
                   bg-transparent flex items-center justify-center gap-2"
            @click="notif.info('Coming soon', `${provider} OAuth integration is in progress`)"
          >
            <span class="text-xs">{{ provider === 'Google' ? 'G' : '⬡' }}</span>
            {{ provider }}
          </button>
        </div>

        <!-- Switch tab -->
        <p class="text-center mt-6 font-barlow-body text-sm text-cream-dim">
          {{ tab === 'login' ? "Don't have an account?" : 'Already registered?' }}
          <button
            class="text-cyan hover:text-cream transition-colors cursor-pointer bg-transparent border-0
                   font-barlow-body text-sm ml-1 underline-offset-2 hover:underline"
            @click="switchTab(tab === 'login' ? 'register' : 'login')"
          >
            {{ tab === 'login' ? 'Register free' : 'Sign in' }}
          </button>
        </p>
      </div>

      <!-- Trust badges -->
      <div class="flex justify-center gap-6 mt-6 flex-wrap">
        <span v-for="b in ['SOC 2','GDPR Ready','256-bit Encryption']" :key="b"
              class="font-mono-tech text-[8px] tracking-[.14em] uppercase text-tan flex items-center gap-1.5">
          <span class="w-1 h-1 bg-cyan" />{{ b }}
        </span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.field-enter-active { transition: all .3s ease; }
.field-leave-active { transition: all .2s ease; }
.field-enter-from   { opacity: 0; transform: translateY(-8px); max-height: 0; }
.field-leave-to     { opacity: 0; transform: translateY(-8px); max-height: 0; }
</style>
