export type Status = 'pending' | 'in_progress' | 'done'

export interface Task {
  id: string
  title: string
  location: string
  time: string
  status: Status
  detail: {
    notificationId: string
    notificationDate: string
    description: string
    planningPlant: string
    functionalLocation: string
    maintenancePlant: string
    equipment: string
    malfunctionDate: string
    malfunctionStartTime: string
  }
}

export const tasksByOffset: Record<number, Task[]> = {
  [-1]: [
    {
      id: '1',
      title: 'Transformatoriaus patikrinimas',
      location: 'Vilniaus st., 3 sektorius',
      time: '09:00',
      status: 'done',
      detail: {
        notificationId: '10209341',
        notificationDate: '2025-10-31',
        description: 'Transformatoriaus patikrinimas',
        planningPlant: 'DA02',
        functionalLocation: 'LG-L02-000VIL-TRNS',
        maintenancePlant: 'DP04',
        equipment: '10091122',
        malfunctionDate: '2025-10-31',
        malfunctionStartTime: '09:00:00',
      },
    },
    {
      id: '2',
      title: 'Perjungiklio remontas',
      location: 'Km 12+500',
      time: '11:00',
      status: 'done',
      detail: {
        notificationId: '10209876',
        notificationDate: '2025-10-31',
        description: 'Perjungiklio remontas',
        planningPlant: 'DA01',
        functionalLocation: 'LG-L01-012500-SWCH',
        maintenancePlant: 'DP03',
        equipment: '10094455',
        malfunctionDate: '2025-10-30',
        malfunctionStartTime: '15:30:00',
      },
    },
    {
      id: '3',
      title: 'Ryšio įrangos apžiūra',
      location: 'Kaišiadorių st.',
      time: '14:00',
      status: 'done',
      detail: {
        notificationId: '10210012',
        notificationDate: '2025-10-31',
        description: 'Ryšio įrangos apžiūra',
        planningPlant: 'DA03',
        functionalLocation: 'LG-L03-000KAI-COMM',
        maintenancePlant: 'DP05',
        equipment: '10088771',
        malfunctionDate: '2025-10-29',
        malfunctionStartTime: '07:45:00',
      },
    },
  ],
  [0]: [
    {
      id: '1',
      title: 'Bėgių apžiūra',
      location: 'Km 45+200 – 45+800',
      time: '08:00',
      status: 'pending',
      detail: {
        notificationId: '10212897',
        notificationDate: '2025-11-01',
        description: 'Bėgių apžiūra',
        planningPlant: 'DA01',
        functionalLocation: 'LG-L01-000GIR-AELS',
        maintenancePlant: 'DP04',
        equipment: '10097086',
        malfunctionDate: '2025-11-03',
        malfunctionStartTime: '10:54:15',
      },
    },
    {
      id: '2',
      title: 'Iešmo Nr. 12 patikrinimas',
      location: 'Kauno st., A peronas',
      time: '10:30',
      status: 'pending',
      detail: {
        notificationId: '10215432',
        notificationDate: '2025-11-01',
        description: 'Iešmo Nr. 12 patikrinimas',
        planningPlant: 'DA02',
        functionalLocation: 'LG-L02-000KAU-SWTS',
        maintenancePlant: 'DP04',
        equipment: '10103421',
        malfunctionDate: '2025-11-02',
        malfunctionStartTime: '08:22:00',
      },
    },
    {
      id: '3',
      title: 'Signalo lempos keitimas',
      location: 'Km 67+100',
      time: '13:00',
      status: 'pending',
      detail: {
        notificationId: '10218765',
        notificationDate: '2025-11-01',
        description: 'Signalo lempos keitimas',
        planningPlant: 'DA03',
        functionalLocation: 'LG-L03-000VIL-SIGS',
        maintenancePlant: 'DP05',
        equipment: '10089234',
        malfunctionDate: '2025-11-01',
        malfunctionStartTime: '14:10:30',
      },
    },
  ],
  [1]: [
    {
      id: '1',
      title: 'Apsaugos relės keitimas',
      location: 'Lentvario st.',
      time: '08:30',
      status: 'pending',
      detail: {
        notificationId: '10221034',
        notificationDate: '2025-11-02',
        description: 'Apsaugos relės keitimas',
        planningPlant: 'DA01',
        functionalLocation: 'LG-L01-000LEN-RELY',
        maintenancePlant: 'DP03',
        equipment: '10101567',
        malfunctionDate: '2025-11-02',
        malfunctionStartTime: '08:00:00',
      },
    },
    {
      id: '2',
      title: 'Kabelių kanalo apžiūra',
      location: 'Km 88+000 – 88+600',
      time: '11:00',
      status: 'pending',
      detail: {
        notificationId: '10221198',
        notificationDate: '2025-11-02',
        description: 'Kabelių kanalo apžiūra',
        planningPlant: 'DA02',
        functionalLocation: 'LG-L02-088000-CBLE',
        maintenancePlant: 'DP04',
        equipment: '10096312',
        malfunctionDate: '2025-11-01',
        malfunctionStartTime: '16:45:00',
      },
    },
    {
      id: '3',
      title: 'Semaforo lempos keitimas',
      location: 'Naujoji Vilnia st.',
      time: '14:30',
      status: 'pending',
      detail: {
        notificationId: '10221445',
        notificationDate: '2025-11-02',
        description: 'Semaforo lempos keitimas',
        planningPlant: 'DA03',
        functionalLocation: 'LG-L03-000NVL-SGLT',
        maintenancePlant: 'DP05',
        equipment: '10087654',
        malfunctionDate: '2025-11-02',
        malfunctionStartTime: '11:20:00',
      },
    },
  ],
}
