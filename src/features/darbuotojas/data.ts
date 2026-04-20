export type Status = 'pending' | 'in_progress' | 'done'
export type WoStatus = 'ctrd_prel' | 'rel' | 'msgs' | 'tech'

export interface Task {
  id: string
  title: string
  subtitle: string
  location: string
  lat: number
  lng: number
  time: string
  status: Status
  notes: string
  team: string[]
  completionDate: string
  materials: string
  operation: string
  seniorName?: string
  pranesimasId?: string
}

export const tasksByOffset: Record<number, Task[]> = {
  [-1]: [
    {
      id: '1',
      title: 'Transformatoriaus gedimas',
      subtitle: 'Traukos transformatorius T-3',
      location: 'Vilniaus gel. stotis',
      lat: 54.6693, lng: 25.2797,
      time: '09:00',
      status: 'done',
      notes: 'Transformatorius neįsijungia po perkrovimo. Galimas valdymo bloko gedimas.',
      team: ['Algirdas Rimkus', 'Kęstutis Norvaišas', 'Ramūnas Žilinskas'],
      completionDate: '2026-04-12',
      materials: 'Kabeliai',
      operation: 'Patikrinti ir pakeisti gedusią dalį',
    },
    {
      id: '2',
      title: 'Iešmo gedimas',
      subtitle: 'Iešmas Nr. 12',
      location: 'Kauno gel. stotis',
      lat: 54.8972, lng: 23.9232,
      time: '11:00',
      status: 'done',
      notes: 'Iešmas nepervedamas į kitą padėtį. Mechanizmo strigo.',
      team: ['Povilas Stankūnas', 'Henrikas Jokubaitis'],
      completionDate: '2026-04-12',
      materials: 'Saulčiniai',
      operation: 'Pakeisti defektuotą įrangą',
    },
    {
      id: '3',
      title: 'Ryšio įrangos defektas',
      subtitle: 'Ryšio blokas RB-7',
      location: 'Kaišiadorių gel. stotis',
      lat: 54.8628, lng: 24.4628,
      time: '14:00',
      status: 'done',
      notes: 'Nutrūkęs ryšys su dispečeriu. Blokas nereaguoja į komandas.',
      team: ['Ričardas Butkevičius', 'Tautvydas Mikalajūnas'],
      completionDate: '2026-04-12',
      materials: 'Signalizacijos moduliai',
      operation: 'Atlikti sistemos diagnostiką',
    },
  ],
  [0]: [
    {
      id: '3',
      title: 'Šviesoforo defektas',
      subtitle: 'Išleidžiamasis šviesoforas L1',
      location: 'Dūseikių gel. stotis',
      lat: 54.640034, lng: 25.226408,
      time: '13:00',
      status: 'pending',
      notes: 'Dūseikių gel. blogas šviesaforo matomumas',
      team: ['Kęstutis Norvaišas', 'Povilas Stankūnas', 'Henrikas Jokubaitis', 'Ričardas Butkevičius'],
      completionDate: '2026-04-14',
      materials: 'Šviesaforo medžiagos',
      operation: 'Atlikti techninę apžiūrą',
      seniorName: 'Kęstutis Norvaišas',
      pranesimasId: 'seed-27',
    },
    {
      id: '1',
      title: 'Bėgių defektas',
      subtitle: 'Bėgiai km 45+500',
      location: 'Girionių gel. stotis',
      lat: 54.9120, lng: 24.0850,
      time: '08:00',
      status: 'in_progress',
      notes: 'Aptikti bėgių įtrūkimai sekcijoje. Būtina skubi patikra.',
      team: ['Algirdas Rimkus', 'Ramūnas Žilinskas', 'Žygimantas Paulauskas'],
      completionDate: '2026-04-13',
      materials: 'Bėgiai',
      operation: 'Atlikti techninę apžiūrą',
    },
  ],
  [1]: [
    {
      id: '1',
      title: 'Apsaugos relės gedimas',
      subtitle: 'Relė AR-15',
      location: 'Lentvario gel. stotis',
      lat: 54.6431, lng: 25.0533,
      time: '08:30',
      status: 'pending',
      notes: 'Relė nesuveikia esant perkrovai. Reikalingas keitimas.',
      team: ['Algirdas Rimkus', 'Tautvydas Mikalajūnas'],
      completionDate: '2026-04-14',
      materials: 'Signalizacijos moduliai',
      operation: 'Pakeisti defektuotą įrangą',
    },
    {
      id: '2',
      title: 'Kabelių defektas',
      subtitle: 'Kabelių kanalas km 88+300',
      location: 'Naujosios Vilnios gel. stotis',
      lat: 54.6617, lng: 25.3883,
      time: '11:00',
      status: 'pending',
      notes: 'Kabelių kanalas pažeistas dėl drėgmės. Izoliacija suirusi.',
      team: ['Ramūnas Žilinskas', 'Žygimantas Paulauskas'],
      completionDate: '2026-04-14',
      materials: 'Kabeliai',
      operation: 'Pakeisti kabelius',
    },
    {
      id: '3',
      title: 'Šviesoforo defektas',
      subtitle: 'Išleidžiamasis šviesoforas S-4',
      location: 'Naujosios Vilnios gel. stotis',
      lat: 54.6617, lng: 25.3883,
      time: '14:30',
      status: 'pending',
      notes: 'Šviesoforas rodo klaidingą signalą. Galimas lempos gedimas.',
      team: ['Kęstutis Norvaišas', 'Henrikas Jokubaitis'],
      completionDate: '2026-04-14',
      materials: 'Kontaktinis laidas',
      operation: 'Pakeisti šviesoforo lempas',
    },
  ],
}
