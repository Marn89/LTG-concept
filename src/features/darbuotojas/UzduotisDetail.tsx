import { Box, Typography, Stack, IconButton, Divider, Button, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { tasksByOffset } from './data'

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ px: 2, py: 1 }}>
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

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {task && (
          <>
            <FieldRow label="Funkcinė lokacija" value={task.location} />
            <FieldRow label="Techninis objektas" value={task.subtitle} />
            <FieldRow label="Gedimo tipas" value={task.title} />

            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.25 }}>
                Papildoma informacija
              </Typography>
              <Typography variant="body2">{task.notes || '—'}</Typography>
            </Box>

            <Divider />

            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
                Komanda
              </Typography>
              {task.team.map(name => (
                <Stack key={name} direction="row" alignItems="center" spacing={0.5}>
                  <Typography variant="body2">{name}</Typography>
                  {name === task.seniorName && (
                    <Tooltip title="Vyr. Technikas" placement="right">
                      <ManageAccountsIcon sx={{ fontSize: 14, color: '#F59E0B', cursor: 'default' }} />
                    </Tooltip>
                  )}
                </Stack>
              ))}
            </Box>

            <FieldRow label="Atlikimo data" value={task.completionDate} />
            <FieldRow label="Medžiagos" value={task.materials} />
            <FieldRow label="Operacija (ką atlikti)" value={task.operation} />

            <Divider />

            <Box sx={{ px: 2, pt: 1.5, pb: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                Nuotraukos
              </Typography>
              <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 0.5 }}>
                {['/images/railway-signal-snow.jpg'].map((src, i) => (
                  <Box
                    key={i}
                    component="img"
                    src={src}
                    sx={{ width: 80, height: 80, borderRadius: '8px', flexShrink: 0, objectFit: 'cover' }}
                  />
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Box>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button variant="contained" fullWidth>
          Atlikta
        </Button>
      </Box>
    </Box>
  )
}
