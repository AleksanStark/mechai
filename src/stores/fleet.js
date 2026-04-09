import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const SEED_FLEET = [
  { id:'F-001', year:2021, make:'Ford',     model:'F-150 XLT',      score:91, status:'ok',   mileage:'34,200', lastScan:'2d ago',  repairCost:200,  vin:'1FTEW1EP0MFA00001' },
  { id:'F-002', year:2019, make:'Toyota',   model:'Camry XLE',       score:72, status:'warn', mileage:'68,400', lastScan:'5d ago',  repairCost:1500, vin:'4T1B11HKXKU500284' },
  { id:'F-003', year:2018, make:'Honda',    model:'CR-V EX',         score:84, status:'ok',   mileage:'52,100', lastScan:'1d ago',  repairCost:320,  vin:'2HKRW2H54JH600123' },
  { id:'F-004', year:2017, make:'BMW',      model:'3 Series 330i',   score:48, status:'crit', mileage:'91,700', lastScan:'12d ago', repairCost:4800, vin:'WBA8A9C51HK700321' },
  { id:'F-005', year:2022, make:'Tesla',    model:'Model 3 LR',      score:96, status:'ok',   mileage:'18,500', lastScan:'3d ago',  repairCost:80,   vin:'5YJ3E1EA1NF000005' },
  { id:'F-006', year:2020, make:'Chevy',    model:'Silverado 1500',  score:67, status:'warn', mileage:'74,300', lastScan:'7d ago',  repairCost:950,  vin:'1GCRYDED0LZ200616' },
  { id:'F-007', year:2016, make:'Mercedes', model:'C-Class C300',    score:55, status:'warn', mileage:'108,200',lastScan:'9d ago',  repairCost:2100, vin:'55SWF4JB2GU100777' },
  { id:'F-008', year:2023, make:'Hyundai',  model:'Ioniq 6 SE',      score:99, status:'ok',   mileage:'8,900',  lastScan:'1d ago',  repairCost:0,    vin:'KMHM34AC5PA000008' },
]

export const useFleetStore = defineStore('fleet', () => {
  const vehicles = ref(JSON.parse(localStorage.getItem('mechai_fleet') || JSON.stringify(SEED_FLEET)))

  const totalRepairCost = computed(() => vehicles.value.reduce((s, v) => s + v.repairCost, 0))
  const avgScore        = computed(() => Math.round(vehicles.value.reduce((s, v) => s + v.score, 0) / vehicles.value.length))
  const criticalCount   = computed(() => vehicles.value.filter(v => v.status === 'crit').length)
  const byStatus        = computed(() => ({
    ok:   vehicles.value.filter(v => v.status === 'ok').length,
    warn: vehicles.value.filter(v => v.status === 'warn').length,
    crit: vehicles.value.filter(v => v.status === 'crit').length,
  }))

  function save() { localStorage.setItem('mechai_fleet', JSON.stringify(vehicles.value)) }

  function addVehicle(v) {
    vehicles.value.unshift({ ...v, id: 'F-' + String(vehicles.value.length + 1).padStart(3, '0') })
    save()
  }

  function removeVehicle(id) {
    vehicles.value = vehicles.value.filter(v => v.id !== id)
    save()
  }

  function updateVehicle(id, patch) {
    const i = vehicles.value.findIndex(v => v.id === id)
    if (i >= 0) { vehicles.value[i] = { ...vehicles.value[i], ...patch }; save() }
  }

  return { vehicles, totalRepairCost, avgScore, criticalCount, byStatus, addVehicle, removeVehicle, updateVehicle }
})
