import { Box, Typography, Stack, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import PersonIcon from '@mui/icons-material/Person'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { tasksByOffset } from './data'

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
        {label}
      </Typography>
      <Typography variant="body2" color={value ? 'text.primary' : 'text.disabled'}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

export function UzduotisDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const offset = Number(searchParams.get('offset') ?? 0)

  const task = (tasksByOffset[offset] ?? tasksByOffset[0]).find(t => t.id === id)

  const stored = task ? localStorage.getItem(`ltg_task_${task.title}`) : null
  const assignment: { date: string; time: string; komanda: string[]; senior: string | null } | null = stored ? JSON.parse(stored) : null

  const DEFAULT_KOMANDA = ['Algirdas Rimkus', 'Kęstutis Norvaišas', 'Ramūnas Žilinskas']
  const DEFAULT_SENIOR = 'Algirdas Rimkus'
  const komanda = assignment?.komanda?.length ? assignment.komanda : DEFAULT_KOMANDA
  const senior = assignment ? assignment.senior : DEFAULT_SENIOR

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Užduotis
        </Typography>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {task && (
          <Stack spacing={2}>
            <FieldRow label="Tech. objektas" value={task.title} />
            <FieldRow label="Užduotis" value={task.subtitle} />

            <Divider />

            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Komanda
              </Typography>
              {komanda.length > 0 ? (
                <Stack spacing={0.75}>
                  {komanda.map(name => (
                    <Stack key={name} direction="row" alignItems="center" spacing={1}>
                      {name === senior
                        ? <PersonIcon sx={{ fontSize: 16, color: 'success.main' }} />
                        : <PersonOutlineIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      }
                      <Typography variant="body2" component="span">
                        {name}
                        {name === senior && (
                          <Typography variant="body2" component="span" color="text.secondary"> (Vyr. tech. darbuotojas)</Typography>
                        )}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.disabled">—</Typography>
              )}
            </Box>

            <Divider />

            <Stack direction="row" spacing={3}>
              <FieldRow label="Atlikimo data" value={assignment?.date ?? '2026.05.05'} />
              <FieldRow label="Laikas" value={assignment?.time ?? '8:00'} />
            </Stack>
          </Stack>
        )}
      </Box>
    </Box>
  )
}
