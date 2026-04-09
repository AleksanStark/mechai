import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user  = ref(JSON.parse(localStorage.getItem('mechai_user') || 'null'))
  const token = ref(localStorage.getItem('mechai_token') || null)

  const isLoggedIn  = computed(() => !!token.value)
  const displayName = computed(() => user.value?.name || 'Rider')
  const plan        = computed(() => user.value?.plan || 'free')
  const initials    = computed(() => {
    if (!user.value?.name) return 'ME'
    return user.value.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  })

  async function login(email, password) {
    // Simulate API call
    await delay(900)
    if (password.length < 6) throw new Error('Invalid credentials')
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).slice(2, 8),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      plan: 'marshal',
      avatar: null,
      scansUsed: 47,
      scansLimit: 500,
      joinedAt: new Date().toISOString(),
    }
    const mockToken = 'tok_' + Math.random().toString(36).slice(2, 18)
    user.value  = mockUser
    token.value = mockToken
    localStorage.setItem('mechai_user',  JSON.stringify(mockUser))
    localStorage.setItem('mechai_token', mockToken)
    return mockUser
  }

  async function register(name, email, password) {
    await delay(1100)
    if (password.length < 6) throw new Error('Password must be at least 6 characters')
    const mockUser = {
      id: 'usr_' + Math.random().toString(36).slice(2, 8),
      name,
      email,
      plan: 'scout',
      avatar: null,
      scansUsed: 0,
      scansLimit: 50,
      joinedAt: new Date().toISOString(),
    }
    const mockToken = 'tok_' + Math.random().toString(36).slice(2, 18)
    user.value  = mockUser
    token.value = mockToken
    localStorage.setItem('mechai_user',  JSON.stringify(mockUser))
    localStorage.setItem('mechai_token', mockToken)
    return mockUser
  }

  function logout() {
    user.value  = null
    token.value = null
    localStorage.removeItem('mechai_user')
    localStorage.removeItem('mechai_token')
  }

  async function updateProfile(patch) {
    await delay(600)
    user.value = { ...user.value, ...patch }
    localStorage.setItem('mechai_user', JSON.stringify(user.value))
  }

  return { user, token, isLoggedIn, displayName, plan, initials, login, register, logout, updateProfile }
})

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }
