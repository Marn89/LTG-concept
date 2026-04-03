import type { Status } from '../darbuotojas/data'

export interface WorkerTask {
  id: string
  title: string
  location: string
  time: string
  status: Status
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
      { id: 'w1-1', title: 'Bėgių apžiūra', location: 'Km 45+200 – 45+800', time: '08:00', status: 'in_progress' },
      { id: 'w1-2', title: 'Iešmo Nr. 12 patikrinimas', location: 'Kauno st., A peronas', time: '10:30', status: 'pending' },
      { id: 'w1-3', title: 'Signalo lempos keitimas', location: 'Km 67+100', time: '13:00', status: 'pending' },
    ],
  },
  {
    workerId: 'w2',
    workerName: 'Petras Kazlauskas',
    tasks: [
      { id: 'w2-1', title: 'Apsaugos relės keitimas', location: 'Lentvario st.', time: '08:30', status: 'done' },
      { id: 'w2-2', title: 'Kabelių kanalo apžiūra', location: 'Km 88+000 – 88+600', time: '11:00', status: 'in_progress' },
    ],
  },
  {
    workerId: 'w3',
    workerName: 'Jonas Stankevičius',
    tasks: [
      { id: 'w3-1', title: 'Semaforo lempos keitimas', location: 'Naujoji Vilnia st.', time: '14:30', status: 'pending' },
    ],
  },
]
