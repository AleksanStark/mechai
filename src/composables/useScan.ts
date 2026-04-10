import { ref, computed } from 'vue'
import type { ScanStage, PhotoPreview } from '../types'

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

interface ScanPhase {
  label:  string
  target: number
  ms:     number
}

const PHASES: ScanPhase[] = [
  { label: 'Preprocessing images…',      target: 18,  ms: 80 },
  { label: 'Running neural inference…',  target: 52,  ms: 55 },
  { label: 'Mapping defect zones…',      target: 74,  ms: 65 },
  { label: 'Calculating repair costs…',  target: 88,  ms: 90 },
  { label: 'Generating report…',         target: 100, ms: 60 },
]

export function useScan() {
  const stage        = ref<ScanStage>('idle')
  const progress     = ref<number>(0)
  const files        = ref<File[]>([])
  const previews     = ref<PhotoPreview[]>([])
  const reportId     = ref<string | null>(null)
  const error        = ref<string | null>(null)
  const currentPhase = ref<string>('')

  const canScan = computed(() => files.value.length > 0 && stage.value === 'idle')

  function addFiles(incoming: FileList | File[]): void {
    const arr = Array.from(incoming).slice(0, 8 - files.value.length)
    arr.forEach(f => {
      files.value.push(f)
      const reader = new FileReader()
      reader.onload = e => {
        previews.value.push({ src: (e.target?.result as string) ?? '', name: f.name })
      }
      reader.readAsDataURL(f)
    })
  }

  function removeFile(i: number): void {
    files.value.splice(i, 1)
    previews.value.splice(i, 1)
  }

  async function startScan(): Promise<void> {
    if (!files.value.length) return
    stage.value    = 'scanning'
    progress.value = 0
    error.value    = null

    for (const phase of PHASES) {
      currentPhase.value = phase.label
      while (progress.value < phase.target) {
        await delay(phase.ms)
        progress.value = Math.min(
          progress.value + Math.random() * 3 + 1,
          phase.target
        )
      }
    }

    await delay(400)
    reportId.value = 'RPT-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    stage.value    = 'done'
  }

  function reset(): void {
    stage.value    = 'idle'
    progress.value = 0
    files.value    = []
    previews.value = []
    reportId.value = null
    error.value    = null
    currentPhase.value = ''
  }

  return {
    stage, progress, files, previews,
    reportId, error, currentPhase, canScan,
    addFiles, removeFile, startScan, reset,
  }
}
