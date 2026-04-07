import type { WoStatus } from '../darbuotojas/data'

export interface WorkerTask {
  id: string
  title: string
  location: string
  time: string
  date: string
  status: WoStatus
}

export interface WorkerGroup {
  workerId: string
  workerName: string
  tasks: WorkerTask[]
}

export const todayWorkerGroups: WorkerGroup[] = [
  {
    workerId: 'w1',
    workerName: 'Aleksas Jonaitis',
    tasks: [
      { id: 'w1-1', title: 'Bėgių apžiūra', location: 'Km 45+200 – 45+800', time: '08:00', date: '2026-04-07', status: 'msgs' },
      { id: 'w1-2', title: 'Iešmo Nr. 12 patikrinimas', location: 'Kauno st., A peronas', time: '10:30', date: '2026-04-06', status: 'ctrd_prel' },
      { id: 'w1-3', title: 'Signalo lempos keitimas', location: 'Km 67+100', time: '13:00', date: '2026-04-05', status: 'rel' },
    ],
  },
  {
    workerId: 'w2',
    workerName: 'Petras Kazlauskas',
    tasks: [
      { id: 'w2-1', title: 'Apsaugos relės keitimas', location: 'Lentvario st.', time: '08:30', date: '2026-04-07', status: 'tech' },
      { id: 'w2-2', title: 'Kabelių kanalo apžiūra', location: 'Km 88+000 – 88+600', time: '11:00', date: '2026-04-06', status: 'msgs' },
    ],
  },
  {
    workerId: 'w3',
    workerName: 'Jonas Stankevičius',
    tasks: [
      { id: 'w3-1', title: 'Semaforo lempos keitimas', location: 'Naujoji Vilnia st.', time: '14:30', date: '2026-04-05', status: 'ctrd_prel' },
    ],
  },
]
