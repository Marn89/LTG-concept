import { useState, useEffect } from 'react'
import {
  Stack, Typography, Select, MenuItem, ToggleButton, ToggleButtonGroup, FormControl, InputLabel,
} from '@mui/material'

const UNITS = [
  { singular: 'diena',   plural: 'dienos',   value: 'DAILY' },
  { singular: 'savaitė', plural: 'savaitės',  value: 'WEEKLY' },
  { singular: 'mėnuo',  plural: 'mėnesiai', value: 'MONTHLY' },
  { singular: 'metai',  plural: 'metų',     value: 'YEARLY' },
]

const DAYS = [
  { label: 'P',  value: 'MO' },
  { label: 'A',  value: 'TU' },
  { label: 'T',  value: 'WE' },
  { label: 'K',  value: 'TH' },
  { label: 'Pn', value: 'FR' },
  { label: 'Š',  value: 'SA' },
  { label: 'S',  value: 'SU' },
]

const MENU_PROPS = {
  anchorOrigin: { vertical: 'bottom' as const, horizontal: 'left' as const },
  transformOrigin: { vertical: 'top' as const, horizontal: 'left' as const },
  PaperProps: { sx: { maxHeight: 300 } },
}

function parseRrule(v?: string | null) {
  const freq = v?.match(/FREQ=(\w+)/)?.[1] ?? 'WEEKLY'
  const interval = Number(v?.match(/INTERVAL=(\d+)/)?.[1] ?? 1)
  const byday = v?.match(/BYDAY=(\w+)/)?.[1] ?? null
  const bmd = v?.match(/BYMONTHDAY=(\d+)/)?.[1]
  return {
    unit: freq,
    interval,
    selectedDay: freq === 'WEEKLY' ? byday : null,
    dayOfMonth: (freq === 'MONTHLY' || freq === 'YEARLY') && bmd ? Number(bmd) : ('' as number | ''),
  }
}

interface Props {
  onChange: (rrule: string | null) => void
  initialValue?: string | null
}

export function RecurrencePicker({ onChange, initialValue }: Props) {
  const init = parseRrule(initialValue)
  const [interval, setInterval] = useState<number>(init.interval)
  const [unit, setUnit] = useState<string>(init.unit)
  const [selectedDay, setSelectedDay] = useState<string | null>(init.selectedDay)
  const [dayOfMonth, setDayOfMonth] = useState<number | ''>(init.dayOfMonth)
  const isWeekly = unit === 'WEEKLY'
  const isMonthly = unit === 'MONTHLY' || unit === 'YEARLY'

  useEffect(() => {
    let rrule = `FREQ=${unit}`
    if (interval > 1) rrule += `;INTERVAL=${interval}`
    if (isWeekly && selectedDay) rrule += `;BYDAY=${selectedDay}`
    if (isMonthly && dayOfMonth !== '') rrule += `;BYMONTHDAY=${dayOfMonth}`
    onChange(rrule)
  }, [interval, unit, selectedDay, dayOfMonth])

  const handleUnitChange = (v: string) => {
    setUnit(v)
    setSelectedDay(null)
    setDayOfMonth('')
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          Kartoti kas
        </Typography>
        <Select
          value={interval}
          onChange={e => setInterval(Number(e.target.value))}
          size="small"
          sx={{ minWidth: 72 }}
          MenuProps={MENU_PROPS}
        >
          {Array.from({ length: 30 }, (_, i) => i + 1).map(n => (
            <MenuItem key={n} value={n}>{n}</MenuItem>
          ))}
        </Select>
        <Select
          value={unit}
          onChange={e => handleUnitChange(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
          MenuProps={MENU_PROPS}
        >
          {UNITS.map(u => (
            <MenuItem key={u.value} value={u.value}>{interval === 1 ? u.singular : u.plural}</MenuItem>
          ))}
        </Select>
      </Stack>

      {isWeekly && (
        <Stack spacing={0.75}>
          <Typography variant="caption" color="text.secondary">
            Pasirinkite kurią dieną
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={selectedDay}
            onChange={(_, v) => { if (v !== null) setSelectedDay(v) }}
            size="small"
            sx={{ flexWrap: 'wrap', gap: 0.5 }}
          >
            {DAYS.map(d => (
              <ToggleButton
                key={d.value}
                value={d.value}
                sx={{
                  width: 36, height: 36, borderRadius: '50% !important',
                  border: '1px solid !important',
                  borderColor: 'divider !important',
                  fontSize: '0.75rem',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderColor: 'primary.main !important',
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                {d.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      )}

      {isMonthly && (
        <FormControl size="small" fullWidth>
          <InputLabel>Pasirinkite mėnesio dieną</InputLabel>
          <Select
            value={dayOfMonth}
            onChange={e => setDayOfMonth(Number(e.target.value))}
            label="Pasirinkite mėnesio dieną"
            MenuProps={MENU_PROPS}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
              <MenuItem key={d} value={d}>{d} d.</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

    </Stack>
  )
}
