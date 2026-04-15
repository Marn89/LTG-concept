import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MobileShell } from '../layout/MobileShell'

const roles = [
  {
    id: 'darbuotojas',
    label: 'Tech darbuotojas',
    description: 'Techninių darbų vykdytojas',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
  },
  {
    id: 'vadovas',
    label: 'Tech priežiūros vadovas',
    description: 'Techninių darbų vadovas',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    id: 'planuotojas',
    label: 'Planuotojas',
    description: 'Darbų planavimas ir grafikai',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
      </svg>
    ),
  },
]

export function LoginPage() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const handleContinue = () => {
    if (selected) navigate(`/${selected}`)
  }

  return (
    <MobileShell>
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-10">
        <div className="w-full">
          <div className="text-center mb-10">
            <div className="mb-4">
              <img src="/images/ltg-logo.png" alt="LTG Infra" className="w-16 h-16 object-contain mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">LTG</h1>
            <p className="mt-1 text-sm text-gray-500">Pasirinkite savo rolę</p>
          </div>

          <div className="flex flex-col gap-4">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`
                  flex items-center gap-4 w-full px-5 py-4 rounded-lg border-2 text-left
                  transition-all duration-150 cursor-pointer
                  ${selected === role.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 bg-white text-gray-800 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }
                `}
              >
                <span className={selected === role.id ? 'text-emerald-600' : 'text-gray-400'}>
                  {role.icon}
                </span>
                <div>
                  <p className="font-semibold text-base leading-tight">{role.label}</p>
                  <p className={`text-xs mt-0.5 ${selected === role.id ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {role.description}
                  </p>
                </div>
                {selected === role.id && (
                  <span className="ml-auto text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            disabled={!selected}
            onClick={handleContinue}
            className="mt-6 w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold text-sm
              transition-all duration-150
              disabled:opacity-40 disabled:cursor-not-allowed
              hover:bg-emerald-700 active:scale-[0.98]"
          >
            Tęsti
          </button>
        </div>
      </div>
    </MobileShell>
  )
}
