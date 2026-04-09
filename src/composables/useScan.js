import { ref, computed } from 'vue'

export const DEFECT_CATEGORIES = [
  { id: 'body',    label: 'Exterior Body',    icon: '🚗' },
  { id: 'glass',   label: 'Glass & Seals',    icon: '🪟' },
  { id: 'wheels',  label: 'Wheels & Tires',   icon: '🛞' },
  { id: 'lights',  label: 'Lighting',         icon: '💡' },
  { id: 'rust',    label: 'Rust & Corrosion', icon: '⚡' },
  { id: 'paint',   label: 'Paint & Finish',   icon: '🎨' },
]

export function useScan() {
  const stage      = ref('idle')   // idle | uploading | scanning | done
  const progress   = ref(0)
  const files      = ref([])
  const previews   = ref([])
  const reportId   = ref(null)
  const error      = ref(null)

  function addFiles(newFiles) {
    const arr = Array.from(newFiles).slice(0, 8 - files.value.length)
    arr.forEach(f => {
      files.value.push(f)
      const reader = new FileReader()
      reader.onload = e => previews.value.push({ src: e.target.result, name: f.name })
      reader.readAsDataURL(f)
    })
  }

  function removeFile(i) {
    files.value.splice(i, 1)
    previews.value.splice(i, 1)
  }

  async function startScan() {
    if (!files.value.length) return
    stage.value    = 'scanning'
    progress.value = 0
    error.value    = null

    // Simulate AI processing with realistic phases
    const phases = [
      { label: 'Preprocessing images…',     target: 18,  ms: 80  },
      { label: 'Running neural inference…', target: 52,  ms: 55  },
      { label: 'Mapping defect zones…',     target: 74,  ms: 65  },
      { label: 'Calculating repair costs…', target: 88,  ms: 90  },
      { label: 'Generating report…',        target: 100, ms: 60  },
    ]

    for (const phase of phases) {
      currentPhase.value = phase.label
      while (progress.value < phase.target) {
        await sleep(phase.ms)
        progress.value = Math.min(progress.value + Math.random() * 3 + 1, phase.target)
      }
    }

    await sleep(400)
    reportId.value = 'RPT-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    stage.value    = 'done'
  }

  function reset() {
    stage.value    = 'idle'
    progress.value = 0
    files.value    = []
    previews.value = []
    reportId.value = null
    error.value    = null
    currentPhase.value = ''
  }

  const currentPhase = ref('')
  const canScan      = computed(() => files.value.length > 0 && stage.value === 'idle')

  return {
    stage, progress, files, previews,
    reportId, error, currentPhase, canScan,
    addFiles, removeFile, startScan, reset,
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}
