// ── Vehicle & Fleet ─────────────────────────────────────────
export type VehicleStatus = 'ok' | 'warn' | 'crit'

export interface Vehicle {
  id:          string
  year:        number
  make:        string
  model:       string
  score:       number
  status:      VehicleStatus
  mileage:     string
  lastScan:    string
  repairCost:  number
  vin:         string
}

// ── Scan & Report ────────────────────────────────────────────
export type ScanStage = 'idle' | 'scanning' | 'done'

export interface PhotoPreview {
  src:  string
  name: string
}

export type DefectSeverity = 'crit' | 'warn' | 'ok'

export interface Defect {
  title:    string
  sev:      DefectSeverity
  cost:     string
  loc:      string
  section?: string
}

export interface ReportSection {
  id:       string
  label:    string
  score:    number
  severity: DefectSeverity
  defects:  Defect[]
}

export interface MarketValue {
  low:  number
  mid:  number
  high: number
}

export interface Report {
  vehicle: {
    year:    number
    make:    string
    model:   string
    vin:     string
    mileage: string
    color:   string
    body:    string
  }
  scanDate:        string
  photos:          number
  score:           number
  marketValue:     MarketValue
  repairEstimate:  { low: number; high: number }
  sections:        ReportSection[]
}

// ── Notifications ────────────────────────────────────────────
export type ToastType = 'ok' | 'warn' | 'error' | 'info'

export interface Toast {
  id:       number
  type:     ToastType
  title:    string
  message?: string
  visible:  boolean
}

// ── API Docs ─────────────────────────────────────────────────
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH'
  path:   string
  badge:  string
  desc:   string
}

export interface ApiParam {
  f: string
  t: string
  r: boolean
  d: string
}

export interface ErrorCode {
  code:  number
  label: string
  desc:  string
}

// ── Compare ──────────────────────────────────────────────────
export interface CompareVehicle {
  id:         string
  label:      string
  score:      number
  price:      number
  mileage:    number
  year:       number
  repairCost: number
  status:     VehicleStatus
}

export type WinSide = 'left' | 'right' | 'tie'

export interface CompareMetric {
  label:        string
  leftVal:      number
  rightVal:     number
  win:          WinSide
  format:       (v: CompareVehicle) => string
  higherBetter: boolean
}
