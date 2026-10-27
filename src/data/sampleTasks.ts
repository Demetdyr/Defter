import type { Task } from '../interfaces/Task'
import { shiftDate, toDateKey } from '../utils/dateUtils'

interface SampleTaskSeed {
  title: string
  note: string
  priority: Task['priority']
  dueInDays: number | null
  tag: string
  isCompleted: boolean
  createdDaysAgo: number
}

const sampleTaskSeeds: SampleTaskSeed[] = [
  {
    title: 'Proje ekran görüntüsünü teslim formuna ekle',
    note: 'Formda Netlify bağlantısı ve GitHub deposunun linki de isteniyor.',
    priority: 'high',
    dueInDays: 0,
    tag: 'okul',
    isCompleted: false,
    createdDaysAgo: 2,
  },
  {
    title: 'Elektrik faturasını öde',
    note: 'Son ödeme tarihi geçti, gecikme bedeli eklenmeden halledilmeli.',
    priority: 'high',
    dueInDays: -1,
    tag: 'ev',
    isCompleted: false,
    createdDaysAgo: 6,
  },
  {
    title: 'Haftalık market alışverişi',
    note: 'Süt, yumurta, tam buğday ekmeği, mevsim sebzeleri, kahve.',
    priority: 'low',
    dueInDays: 1,
    tag: 'ev',
    isCompleted: false,
    createdDaysAgo: 1,
  },
  {
    title: 'React Router belgelerinde dinamik rotalar bölümünü oku',
    note: '',
    priority: 'normal',
    dueInDays: 3,
    tag: 'okul',
    isCompleted: false,
    createdDaysAgo: 3,
  },
  {
    title: 'Sunum taslağı için geri bildirimleri topla',
    note: 'Ayşe ve Mert yorumlarını cuma gününe kadar gönderecek.',
    priority: 'normal',
    dueInDays: 9,
    tag: 'iş',
    isCompleted: false,
    createdDaysAgo: 4,
  },
  {
    title: 'Bilgisayarın yedeğini harici diske al',
    note: '',
    priority: 'normal',
    dueInDays: null,
    tag: 'kişisel',
    isCompleted: true,
    createdDaysAgo: 8,
  },
  {
    title: 'Sabah koşusu, 5 km',
    note: '',
    priority: 'low',
    dueInDays: null,
    tag: 'kişisel',
    isCompleted: true,
    createdDaysAgo: 5,
  },
]

export function createSampleTasks(today: Date): Task[] {
  return sampleTaskSeeds.map((seed, seedIndex) => {
    const createdAt = shiftDate(today, -seed.createdDaysAgo)
    createdAt.setHours(9 + seedIndex, 15, 0, 0)
    const timestamp = createdAt.toISOString()
    return {
      id: `ornek-${seedIndex + 1}`,
      title: seed.title,
      note: seed.note,
      priority: seed.priority,
      dueDate: seed.dueInDays === null ? null : toDateKey(shiftDate(today, seed.dueInDays)),
      tag: seed.tag,
      isCompleted: seed.isCompleted,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  })
}
