import { useState, useEffect, useRef } from 'react'
import { NOW } from '../utils/now'
import { useLocation } from 'react-router-dom'
import {
  Box, Typography, TextField, IconButton, Stack, Divider,
} from '@mui/material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ReplyIcon from '@mui/icons-material/Reply'
import SendIcon from '@mui/icons-material/Send'

interface Reply {
  id: string
  text: string
  time: string
}

interface Comment {
  id: string
  text: string
  time: string
  path: string
  replies: Reply[]
}

const persist = (c: Comment[]) =>
  fetch('/api/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })

export function CommentPanel() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])

  useEffect(() => {
    fetch('/api/notes').then(r => r.json()).then(setComments).catch(() => {})
  }, [])
  const [newText, setNewText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'C') setOpen(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const update = (next: Comment[]) => { setComments(next); persist(next) }

  const now = () => NOW.toLocaleTimeString('lt-LT', { hour: '2-digit', minute: '2-digit' })

  const visible = comments.filter(c => c.path === pathname)

  const addComment = () => {
    if (!newText.trim()) return
    update([...comments, { id: Date.now().toString(), text: newText.trim(), time: now(), path: pathname, replies: [] }])
    setNewText('')
  }

  const deleteComment = (id: string) => update(comments.filter(c => c.id !== id))

  const addReply = (cid: string) => {
    if (!replyText.trim()) return
    update(comments.map(c => c.id === cid
      ? { ...c, replies: [...c.replies, { id: Date.now().toString(), text: replyText.trim(), time: now() }] }
      : c))
    setReplyText('')
    setReplyingTo(null)
  }

  const deleteReply = (cid: string, rid: string) =>
    update(comments.map(c => c.id === cid ? { ...c, replies: c.replies.filter(r => r.id !== rid) } : c))

  if (!open) return null

  return (
    <Box sx={{
      position: 'fixed', top: 0, right: 0, width: 300, height: '100vh',
      bgcolor: 'grey.100', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
    }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="subtitle2" fontWeight={700}>Notes</Typography>
        <Typography variant="caption" color="text.disabled">Shift+C</Typography>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
        <Stack spacing={1.5}>
          {visible.length === 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 4 }}>
              No notes yet
            </Typography>
          )}
          {visible.map(c => (
            <Box key={c.id} sx={{ bgcolor: 'background.paper', borderRadius: 1.5, p: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={0.5}>
                <Typography variant="body2" sx={{ flex: 1, whiteSpace: 'pre-wrap', fontSize: '0.8rem' }}>
                  {c.text}
                </Typography>
                <IconButton size="small" onClick={() => deleteComment(c.id)} sx={{ mt: -0.5, flexShrink: 0 }}>
                  <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mt: 0.5 }}>
                <IconButton size="small" onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}>
                  <ReplyIcon sx={{ fontSize: 14, color: replyingTo === c.id ? 'primary.main' : 'text.disabled' }} />
                </IconButton>
              </Stack>

              {c.replies.length > 0 && (
                <Stack spacing={0.75} sx={{ mt: 1, pl: 1, borderLeft: '2px solid #f9e400' }}>
                  {c.replies.map(r => (
                    <Stack key={r.id} direction="row" justifyContent="space-between" alignItems="flex-start" spacing={0.5}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap', display: 'block' }}>{r.text}</Typography>
                      </Box>
                      <IconButton size="small" onClick={() => deleteReply(c.id, r.id)}>
                        <DeleteOutlineIcon sx={{ fontSize: 12 }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              )}

              {replyingTo === c.id && (
                <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                  <TextField
                    size="small" autoFocus fullWidth multiline maxRows={3}
                    placeholder="Reply…"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addReply(c.id) } }}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.75rem' } }}
                  />
                  <IconButton size="small" onClick={() => addReply(c.id)}>
                    <SendIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Stack>
              )}
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider />
      <Stack direction="row" spacing={0.5} sx={{ p: 1.5, bgcolor: 'background.paper' }}>
        <TextField
          inputRef={inputRef}
          size="small" fullWidth multiline maxRows={4}
          placeholder="Add note… (Enter to save)"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment() } }}
          sx={{ '& .MuiInputBase-input': { fontSize: '0.8rem' } }}
        />
        <IconButton size="small" onClick={addComment}>
          <SendIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>
    </Box>
  )
}
