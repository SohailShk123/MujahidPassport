'use client'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Bell,
  WalletCards,
  BarChart3,
  Download,
  LogOut,
  Plus,
  Search,
  ArrowUpRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  MessageCircle,
  Printer,
  MoreHorizontal,
} from 'lucide-react'

const nav = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['customers', 'Customers', Users],
  ['appointments', 'Appointments', CalendarDays],
  ['reminders', 'Reminders', Bell],
  ['payments', 'Payments', WalletCards],
  ['reports', 'Reports', BarChart3],
  ['backup', 'Backup', Download],
]

const statuses = [
  'New',
  'Documents Pending',
  'Appointment Booked',
  'Submitted',
  'Completed',
  'Rejected',
]
const documentOptions = [
  'Aadhaar Card',
  'Verified Aadhaar',
  'PAN Card',
  'Birth Certificate',
  '10th Marksheet',
  '10th TC',
  '10 Sanad',
  'Address Proof',
  'Bank Passbook',
  'Electricity Bill',
  'Previous Passport',
  'Marriage Certificate',
  'Photo',
  'Annexure - J (Joint Photo)',
  'Annexure - D (Declaration)',
  'Govt. Employee - Job Identity Card',
  'Govt. Employee - Annexure - G',
  'Govt. Employee - Annexure - C',
]

const money = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`

const formatDate = (d) =>
  d
    ? new Date(`${d}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    : '—'

const currentDay = new Date().toISOString().slice(0, 10)

function getDaysUntilAppointment(date) {
  if (!date) return null

  const today = new Date()
  const appointment = new Date(date)

  // Remove time part so only dates are compared
  today.setHours(0, 0, 0, 0)
  appointment.setHours(0, 0, 0, 0)

  const diffTime = appointment - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// const reminderMessage = (c) =>
// `Hello ${c.fullName},

// This is a reminder from PassportDesk.

// Your passport appointment is on ${formatDate(c.appointmentDate)} at ${
//     c.appointmentTime || 'the scheduled time'
//   }.

// File number: ${c.fileNumber}.

// Please bring the following documents:
// ${documentList}

// Thank you.`
const reminderMessage = (c) => {
  const documents = Array.isArray(c.documents) ? c.documents : []

  const documentList =
    documents.length > 0
      ? documents
        .map((doc, index) => {
          // Handles different possible document structures
          const documentName =
            typeof doc === 'string'
              ? doc
              : doc.name ||
              doc.documentName ||
              doc.documentType ||
              doc.title ||
              doc.fileName ||
              'Required document'

          return `${index + 1}. ${documentName}`
        })
        .join('\n')
      : 'Please bring your required documents.'

  return `Hello ${c.fullName},

This is a reminder from PassportDesk.

Your passport appointment is on ${formatDate(c.appointmentDate)} at ${c.appointmentTime || 'the scheduled time'
    }.

File number: ${c.fileNumber}.

Please bring the following documents:
${documentList}

Thank you.`
}
function Login({ onLogin }) {
  const [form, setForm] = useState({
    username: 'admin',
    password: 'admin123',
  })

  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    const r = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    if (r.ok) {
      onLogin()
    } else {
      setError((await r.json()).error)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-11 w-11 rounded-xl bg-blue-600 text-white grid place-items-center font-bold text-xl">
            P
          </div>

          <div>
            <div className="font-bold text-xl text-slate-950">
              Passport Desk
            </div>

            <div className="text-xs text-slate-500">
              Service management CRM
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/40">
          <div className="mb-7">
            <p className="text-sm font-semibold text-blue-600">
              OPERATOR ACCESS
            </p>

            <h1 className="text-3xl font-bold text-slate-950 mt-2">
              Hello Soheb Abrar👋 Welcome back
            </h1>

            <p className="text-slate-500 mt-2">
              Sign in to manage your passport service office.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="block text-sm font-medium">
              Username

              <input
                className="field mt-2"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
              />
            </label>

            <label className="block text-sm font-medium">
              Password

              <input
                type="password"
                className="field mt-2"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button className="primary w-full">
              Sign in to workspace
              <ArrowUpRight size={17} />
            </button>
          </form>

          <p className="text-xs text-slate-400 mt-6 text-center">
            Demo login: admin / admin123
          </p>
        </div>
      </div>
    </main>
  )
}

function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] overflow-auto rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>

          <button onClick={close} className="icon">
            <X size={19} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Stat({ label, value, detail, icon: Icon, tone = 'blue' }) {
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <p className="text-2xl font-bold text-slate-950 mt-2">{value}</p>

          <p className="text-xs text-slate-400 mt-2">{detail}</p>
        </div>

        <div className={`stat-icon ${tone}`}>
          <Icon size={19} />
        </div>
      </div>
    </div>
  )
}

function CustomerForm({ onSave, close }) {
  const [form, setForm] = useState({
    passportType: 'Fresh',
    status: 'New',
    gender: 'Male',
    documents: []
  })

  const set = (k, v) =>
    setForm({
      ...form,
      [k]: v,
    })
  const toggleDocument = (document) => {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.includes(document)
        ? prev.documents.filter((d) => d !== document)
        : [...prev.documents, document],
    }))
  }
  const submit = async (e) => {
    e.preventDefault()

    const r = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })

    if (r.ok) {
      onSave(await r.json())
      close()
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <p className="section-label">Personal details</p>

        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <input
            required
            placeholder="Full name *"
            className="field"
            onChange={(e) => set('fullName', e.target.value)}
          />

          <input
            required
            placeholder="Mobile *"
            className="field"
            onChange={(e) => set('mobile', e.target.value)}
          />

          <input
            placeholder="Alternate mobile"
            className="field"
            onChange={(e) => set('alternateMobile', e.target.value)}
          />

          <input
            placeholder="Address"
            className="field"
            onChange={(e) => set('address', e.target.value)}
          />

          <input
            type="date"
            className="field"
            onChange={(e) => set('dateOfBirth', e.target.value)}
          />

          <select
            className="field"
            onChange={(e) => set('gender', e.target.value)}
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <p className="section-label">Passport & appointment</p>

        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <select
            className="field"
            onChange={(e) => set('passportType', e.target.value)}
          >
            <option>Fresh</option>
            <option>Renewal</option>
            <option>Tatkal</option>
          </select>

          <input
            placeholder="Previous passport number"
            className="field"
            onChange={(e) => set('previousPassport', e.target.value)}
          />

          <input
            placeholder="Passport office"
            className="field"
            onChange={(e) => set('passportOffice', e.target.value)}
          />

          <input
            type="date"
            className="field"
            onChange={(e) => set('appointmentDate', e.target.value)}
          />

          <input
            type="time"
            className="field"
            onChange={(e) => set('appointmentTime', e.target.value)}
          />

          <select
            className="field"
            onChange={(e) => set('status', e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <p className="section-label">Documents submitted</p>

        <div className="grid md:grid-cols-2 gap-3 mt-3">
          {documentOptions.map((document) => (
            <label
              key={document}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={form.documents.includes(document)}
                onChange={() => toggleDocument(document)}
                className="h-4 w-4"
              />

              <span className="text-sm">
                {document}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="section-label">Payment</p>

        <div className="grid md:grid-cols-3 gap-4 mt-3">
          <input
            type="number"
            placeholder="Total amount"
            className="field"
            onChange={(e) => set('governmentFee', e.target.value)}
          />


          <input
            type="number"
            placeholder="Paid amount"
            className="field"
            onChange={(e) => set('paidAmount', e.target.value)}
          />
          <input
            type="number"
            placeholder="Balance amount"
            className="field"
            onChange={(e) => set('serviceCharge', e.target.value)}
          />
        </div>
      </div>

      <textarea
        placeholder="Notes"
        className="field min-h-24"
        onChange={(e) => set('notes', e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button type="button" onClick={close} className="secondary">
          Cancel
        </button>

        <button className="primary">
          <Plus size={17} />
          Create customer
        </button>
      </div>
    </form>
  )
}

function App() {
  const [logged, setLogged] = useState(false)
  const [page, setPage] = useState('dashboard')
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)

    const [a, b] = await Promise.all([
      fetch('/api/customers'),
      fetch('/api/stats'),
    ])

    if (a.ok) setCustomers(await a.json())
    if (b.ok) setStats(await b.json())

    setLoading(false)
  }

  useEffect(() => {
    fetch('/api/auth').then((r) => {
      if (r.ok) {
        setLogged(true)
        load()
      } else {
        setLoading(false)
      }
    })
  }, [])

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          (!query ||
            `${c.fullName} ${c.mobile} ${c.fileNumber}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (filter === 'All' ||
            c.status === filter ||
            c.passportType === filter),
      ),
    [customers, query, filter],
  )

  const logout = async () => {
    await fetch('/api/logout', {
      method: 'DELETE',
    })

    setLogged(false)
  }

  if (!logged) {
    return (
      <Login
        onLogin={() => {
          setLogged(true)
          load()
        }}
      />
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-500">
        Loading workspace…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex">
      <aside className="hidden lg:flex w-64 bg-[#0d1b34] text-white flex-col p-5 fixed inset-y-0">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="h-10 w-10 rounded-xl bg-blue-500 grid place-items-center font-bold text-xl">
            P
          </div>

          <div>
            <b className="tracking-tight">PassportDesk</b>
            <div className="text-[10px] text-blue-200 mt-0.5">
              OFFICE CRM
            </div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              className={`side-link ${page === id ? 'active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

        <button onClick={logout} className="side-link text-slate-300">
          <LogOut size={18} />
          Log out
        </button>
      </aside>

      <main className="lg:ml-64 flex-1 p-5 md:p-8 max-w-[1700px]">
        <header className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-slate-500">
              Tuesday, 18 August 2026
            </p>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-950 mt-1">
              {page === 'dashboard'
                ? 'Good morning, Soheb Abrar'
                : nav.find((n) => n[0] === page)?.[1]}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="secondary hidden md:flex"
              onClick={() => setShowAdd(true)}
            >
              <Plus size={17} />
              Add customer
            </button>

            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 grid place-items-center font-semibold">
              OP
            </div>
          </div>
        </header>

        {page === 'dashboard' && (
          <Dashboard
            stats={stats}
            customers={customers}
            setPage={setPage}
            setSelected={setSelected}
          />
        )}

        {page === 'customers' && (
          <Customers
            customers={filtered}
            query={query}
            setQuery={setQuery}
            filter={filter}
            setFilter={setFilter}
            add={() => setShowAdd(true)}
            setSelected={setSelected}
            onRefresh={load}
          />
        )}

        {page === 'appointments' && (
          <Appointments customers={customers} setSelected={setSelected} />
        )}

        {page === 'reminders' && <Reminders customers={customers} />}

        {page === 'payments' && (
          <Payments customers={customers} setSelected={setSelected} />
        )}

        {page === 'reports' && <Reports stats={stats} />}

        {page === 'backup' && <Backup />}

        {showAdd && (
          <Modal
            title="Add new customer"
            close={() => setShowAdd(false)}
          >
            <CustomerForm
              close={() => setShowAdd(false)}
              onSave={(c) => {
                setCustomers([c, ...customers])
                load()
              }}
            />
          </Modal>
        )}

        {selected && (
          <CustomerDetail
            customer={selected}
            close={() => setSelected(null)}
            refresh={load}
          />
        )}
      </main>
    </div>
  )
}

function Dashboard({ stats, customers, setPage, setSelected }) {
  return (
    <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Stat
          label="Total customers"
          value={stats.totalCustomers || 0}
          detail="All active files"
          icon={Users}
        />

        <Stat
          label="New cases"
          value={stats.newCases || 0}
          detail="Needs attention"
          icon={FileText}
          tone="purple"
        />

        <Stat
          label="Documents pending"
          value={stats.documentsPending || 0}
          detail="Follow up required"
          icon={AlertCircle}
          tone="orange"
        />

        <Stat
          label="Total income"
          value={money(stats.totalIncome)}
          detail="Collected to date"
          icon={WalletCards}
          tone="green"
        />
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        <div className="card xl:col-span-3">
          <div className="card-head">
            <div>
              <h2>Today’s appointments</h2>
              <p>Keep your day moving</p>
            </div>

            <button
              className="text-blue-600 text-sm font-semibold"
              onClick={() => setPage('appointments')}
            >
              View all
            </button>
          </div>

          {(stats.todayAppointments || []).length ? (
            stats.todayAppointments.map((c) => (
              <CustomerRow
                key={c._id}
                c={c}
                onClick={() => setSelected(c)}
              />
            ))
          ) : (
            <Empty
              title="No appointments today"
              text="Your schedule is clear for now."
            />
          )}
        </div>

        <div className="card xl:col-span-2">
          <div className="card-head">
            <div>
              <h2>Recent customers</h2>
              <p>Latest files added</p>
            </div>

            <button className="icon">
              <MoreHorizontal size={19} />
            </button>
          </div>

          {customers.slice(0, 4).map((c) => (
            <div
              className="flex items-center gap-3 py-3 border-b last:border-0 border-slate-100"
              key={c._id}
            >
              <div className="avatar">{c.fullName?.[0]}</div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.fullName}</p>
                <p className="text-xs text-slate-400">{c.fileNumber}</p>
              </div>

              <Status status={c.status} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function Customers({
  customers,
  query,
  setQuery,
  filter,
  setFilter,
  add,
  setSelected,
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, mobile or file number"
            className="field pl-10"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="field md:w-52"
        >
          <option>All</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
          <option>Fresh</option>
          <option>Renewal</option>
          <option>Tatkal</option>
        </select>

        <button className="primary" onClick={add}>
          <Plus size={17} />
          Add customer
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>File number</th>
                <th>Customer</th>
                <th>Passport</th>
                <th>Appointment</th>
                <th>Status</th>
                <th>Payment</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr
                  key={c._id}
                  onClick={() => setSelected(c)}
                >
                  <td className="font-semibold text-blue-700">
                    {c.fileNumber}
                  </td>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar small">
                        {c.fullName?.[0]}
                      </div>

                      <div>
                        <p className="font-semibold">{c.fullName}</p>
                        <p className="text-xs text-slate-400">
                          {c.mobile}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td>{c.passportType}</td>

                  <td>
                    {formatDate(c.appointmentDate)}
                    <br />
                    <span className="text-xs text-slate-400">
                      {c.appointmentTime || ''}
                    </span>
                  </td>

                  <td>
                    <Status status={c.status} />
                  </td>

                  <td>
                    <p className="font-semibold">
                      {money(c.paidAmount)}
                    </p>

                    <p className="text-xs text-red-500">
                      {money(c.balance)} due
                    </p>
                  </td>

                  <td>
                    <MoreHorizontal
                      size={18}
                      className="text-slate-400"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!customers.length && (
            <Empty
              title="No customer files found"
              text="Try changing your search or add a new customer."
            />
          )}
        </div>
      </div>
    </>
  )
}

function CustomerRow({ c, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 border-b border-slate-100 text-left hover:bg-slate-50"
    >
      <div className="avatar">{c.fullName?.[0]}</div>

      <div className="flex-1">
        <p className="font-semibold">{c.fullName}</p>
        <p className="text-xs text-slate-400">
          {c.fileNumber} · {c.mobile}
        </p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-sm">
          {c.appointmentTime || 'Time not set'}
        </p>

        <p className="text-xs text-slate-400">{c.passportType}</p>
      </div>

      <Status status={c.status} />
    </button>
  )
}

function Status({ status }) {
  return (
    <span
      className={`badge ${status === 'Completed'
        ? 'success'
        : status === 'Rejected'
          ? 'danger'
          : status === 'New'
            ? 'blue'
            : 'warning'
        }`}
    >
      {status}
    </span>
  )
}

function Empty({ title, text }) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto h-10 w-10 rounded-full bg-slate-100 grid place-items-center text-slate-400">
        <FileText size={18} />
      </div>

      <p className="font-semibold mt-3">{title}</p>
      <p className="text-sm text-slate-400 mt-1">{text}</p>
    </div>
  )
}

function Appointments({ customers, setSelected }) {

  return (
    <div className="card overflow-hidden">
      <div className="card-head">
        <div>
          <h2>Appointment schedule</h2>
          <p>All booked customer appointments</p>
        </div>

        <span className="badge blue">
          {customers.filter((c) => c.appointmentDate === currentDay).length}{' '}
          today
        </span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>File number</th>
            <th>Date & time</th>
            <th>Passport type</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {customers
            .filter((c) => c.appointmentDate)
            .sort((a, b) =>
              a.appointmentDate.localeCompare(b.appointmentDate),
            )
            .map((c) => (
              <tr
                key={c._id}
                onClick={() => setSelected(c)}
              >
                <td className="font-semibold">
                  {c.fullName}
                  <br />
                  <span className="text-xs text-slate-400">
                    {c.mobile}
                  </span>
                </td>

                <td className="text-blue-700 font-medium">
                  {c.fileNumber}
                </td>

                <td>
                  {formatDate(c.appointmentDate)}
                  <br />
                  <span className="text-xs text-slate-400">
                    {c.appointmentTime}
                  </span>
                </td>

                <td>{c.passportType}</td>

                <td>
                  <Status status={c.status} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

// function Reminders({ customers }) {
//   const upcoming = customers.filter((c) => c.appointmentDate)
//   const markSent = (c) =>
//     fetch('/api/reminders', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         customerId: c._id,
//       }),
//     })

//   const getWhatsAppNumber = (mobile) => {
//     const number = String(mobile || '').replace(/\D/g, '')

//     // Already has India country code
//     if (number.startsWith('91') && number.length === 12) {
//       return number
//     }

//     // 10 digit Indian number
//     if (number.length === 10) {
//       return `91${number}`
//     }

//     // Number starts with 0, e.g. 09876543210
//     if (number.length === 11 && number.startsWith('0')) {
//       return `91${number.slice(1)}`
//     }

//     return number
//   }
//   return (
//     <div className="grid xl:grid-cols-3 gap-5">
//       {['Today', 'Tomorrow', 'In 2 days'].map((label, i) => (
//         <div className="card" key={label}>
//           <div className="card-head">
//             <div>
//               <h2>{label}</h2>
//               <p>Appointment reminders</p>
//             </div>

//             <Bell size={18} className="text-orange-500" />
//           </div>

//           {upcoming.slice(i, i + 4).map((c) => (
//             <div
//               className="py-4 border-b last:border-0 border-slate-100"
//               key={c._id}
//             >
//               <div className="flex justify-between gap-3">
//                 <div>
//                   <p className="font-semibold">{c.fullName}</p>

//                   <p className="text-xs text-slate-400">
//                     {c.fileNumber} · {formatDate(c.appointmentDate)} ·{' '}
//                     {c.appointmentTime || 'Time not set'}
//                   </p>
//                 </div>

//                 {c.reminderSent ? (
//                   <span className="text-xs text-green-600 font-semibold">
//                     Sent
//                   </span>
//                 ) : (
//                   <a
//                     target="_blank"
//                     rel="noreferrer"
//                     onClick={() => markSent(c)}
//                     href={`https://wa.me/${getWhatsAppNumber(c.mobile)}?text=${encodeURIComponent(
//                       reminderMessage(c),
//                     )}`}
//                     className="whatsapp"
//                   >
//                     <MessageCircle size={14} />
//                     WhatsApp
//                   </a>
//                 )}
//               </div>
//             </div>
//           ))}

//           {!upcoming.length && (
//             <Empty
//               title="No upcoming appointments"
//               text="Booked appointments will appear here."
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }
function Reminders({ customers }) {
  const upcoming = customers.filter((c) => {
    if (!c.appointmentDate) return false

    const days = getDaysUntilAppointment(c.appointmentDate)

    return days >= 0
  })

  const markSent = (c) =>
    fetch('/api/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: c._id,
      }),
    })

  const getWhatsAppNumber = (mobile) => {
    const number = String(mobile || '').replace(/\D/g, '')

    // Already has India country code
    if (number.startsWith('91') && number.length === 12) {
      return number
    }

    // 10 digit Indian number
    if (number.length === 10) {
      return `91${number}`
    }

    // Number starts with 0, e.g. 09876543210
    if (number.length === 11 && number.startsWith('0')) {
      return `91${number.slice(1)}`
    }

    return number
  }

  return (
    <div className="grid xl:grid-cols-3 gap-5">
      {['Today', 'Tomorrow', 'Upcoming'].map((label) => {
        const appointments = upcoming.filter((c) => {
          const days = getDaysUntilAppointment(c.appointmentDate)

          if (label === 'Today') return days === 0
          if (label === 'Tomorrow') return days === 1

          return days >= 2
        })

        return (
          <div className="card" key={label}>
            <div className="card-head">
              <div>
                <h2>{label}</h2>
                <p>Appointment reminders</p>
              </div>

              <Bell size={18} className="text-orange-500" />
            </div>

            {/* Scrollable appointment list */}
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {appointments.map((c) => {
                const days = getDaysUntilAppointment(
                  c.appointmentDate,
                )

                return (
                  <div
                    className="py-4 border-b last:border-0 border-slate-100 px-2"
                    key={c._id}
                  >
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold truncate">
                          {c.fullName}
                        </p>

                        <p className="text-xs text-slate-400">
                          {c.fileNumber} ·{' '}
                          {formatDate(c.appointmentDate)} ·{' '}
                          {c.appointmentTime || 'Time not set'}
                        </p>

                        <p className="text-xs font-semibold text-orange-500 mt-1">
                          {days === 0
                            ? 'Appointment is today'
                            : days === 1
                              ? 'Appointment is tomorrow'
                              : `${days} days remaining`}
                        </p>
                      </div>

                      {c.reminderSent ? (
                        <span className="text-xs text-green-600 font-semibold whitespace-nowrap">
                          Sent
                        </span>
                      ) : (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => markSent(c)}
                          href={`https://wa.me/${getWhatsAppNumber(
                            c.mobile,
                          )}?text=${encodeURIComponent(
                            reminderMessage(c),
                          )}`}
                          className="whatsapp whitespace-nowrap"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}

              {appointments.length === 0 && (
                <Empty
                  title={`No ${label.toLowerCase()} appointments`}
                  text="Booked appointments will appear here."
                />
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Payments({ customers, setSelected }) {
  return (
    <div className="card overflow-hidden">
      <div className="card-head">
        <div>
          <h2>Payment overview</h2>
          <p>Track collections and balances</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Total amount</th>
            <th>Paid</th>
            <th>Balance</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr
              key={c._id}
              onClick={() => setSelected(c)}
            >
              <td className="font-semibold">
                {c.fullName}
                <br />
                <span className="text-xs text-blue-600">
                  {c.fileNumber}
                </span>
              </td>

              <td>{money(c.totalAmount)}</td>

              <td className="text-green-600 font-semibold">
                {money(c.paidAmount)}
              </td>

              <td className="text-red-500 font-semibold">
                {money(c.balance)}
              </td>

              <td>
                {c.balance > 0 ? (
                  <span className="badge warning">Pending</span>
                ) : (
                  <span className="badge success">Paid</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Reports({ stats }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Stat
        label="Total customers"
        value={stats.totalCustomers || 0}
        detail="All files"
        icon={Users}
      />

      <Stat
        label="Completed cases"
        value={stats.completed || 0}
        detail="Successfully finished"
        icon={CheckCircle2}
        tone="green"
      />

      <Stat
        label="Total income"
        value={money(stats.totalIncome)}
        detail="Total collected"
        icon={WalletCards}
        tone="blue"
      />

      <Stat
        label="Pending amount"
        value={money(stats.pendingPayments)}
        detail="To be collected"
        icon={AlertCircle}
        tone="orange"
      />
    </div>
  )
}

function Backup() {
  return (
    <div className="card max-w-xl p-8">
      <div className="stat-icon blue mb-5">
        <Download size={21} />
      </div>

      <h2 className="text-xl font-bold">Export customer backup</h2>

      <p className="text-slate-500 mt-2 leading-relaxed">
        Download a CSV spreadsheet containing customer files, appointments,
        statuses and payment totals. Keep a regular copy of your office data.
      </p>

      <Link href="/api/export" className="primary inline-flex mt-6">
        <Download size={17} />
        Download CSV backup
      </Link>
    </div>
  )
}

function CustomerDetail({ customer, close, refresh }) {
  const [status, setStatus] = useState(customer.status)
  const [amount, setAmount] = useState('')

  const update = async (s) => {
    setStatus(s)

    await fetch('/api/customers', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: customer._id,
        status: s,
      }),
    })

    refresh()
  }

  const pay = async (e) => {
    e.preventDefault()

    await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: customer._id,
        amount,
      }),
    })

    setAmount('')
    refresh()
  }

  return (
    <Modal
      title={`${customer.fullName} · ${customer.fileNumber}`}
      close={close}
    >
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => update(s)}
            className={`status-btn ${status === s ? 'selected' : ''
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="mini">
          <span>Name</span>
          <b>{customer.fullName}</b>
        </div>

        <div className="mini">
          <span>Passport type</span>
          <b>{customer.passportType}</b>
        </div>

        <div className="mini">
          <span>Appointment</span>
          <b>
            {formatDate(customer.appointmentDate)}{' '}
            {customer.appointmentTime}
          </b>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://wa.me/${customer.mobile}?text=${encodeURIComponent(
            reminderMessage(customer),
          )}`}
          className="whatsapp px-4 py-2.5"
        >
          <MessageCircle size={16} />
          Send appointment message on WhatsApp
        </a>

        <button
          className="secondary"
          onClick={() => window.print()}
        >
          <Printer size={16} />
          Print receipt
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="section-label">Payment summary</p>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div>
              <span className="text-xs text-slate-400">Total</span>
              <p className="font-bold">{money(customer.totalAmount)}</p>
            </div>

            <div>
              <span className="text-xs text-slate-400">Paid</span>
              <p className="font-bold text-green-600">
                {money(customer.paidAmount)}
              </p>
            </div>

            <div>
              <span className="text-xs text-slate-400">Balance</span>
              <p className="font-bold text-red-500">
                {money(customer.balance)}
              </p>
            </div>
          </div>

          <form onSubmit={pay} className="flex gap-2 mt-5">
            <input
              required
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Payment amount"
              className="field"
            />

            <button className="primary">Add payment</button>
          </form>

          <div className="mt-5 space-y-2">
            {(customer.payments || []).map((p) => (
              <div
                className="flex justify-between text-sm p-3 rounded-lg bg-slate-50"
                key={p.id}
              >
                <span>{formatDate(p.date)}</span>
                <b>{money(p.amount)}</b>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label">Documents</p>

          <div className="mt-3 space-y-2">
            {[
              'Aadhaar Card',
              'Verified Aadhaar',
              'PAN Card',
              'Birth Certificate',
              '10th Marksheet',
              '10th TC',
              '10 Sanad',
              'Address Proof',
              'Bank Passbook',
              'Electricity Bill',
              'Previous Passport',
              'Marriage Certificate',
              'Photo',
              'Annexure - J (Joint Photo)',
              'Annexure - D (Declaration)',
              'Govt. Employee - Job Identity Card',
              'Govt. Employee - Annexure - G',
              'Govt. Employee - Annexure - C',
              'Other',
            ].map((d) => (
              <div
                className="flex items-center justify-between p-3 border border-dashed border-slate-200 rounded-lg"
                key={d}
              >
                <span className="text-sm">{d}</span>
                <span
                  className={`text-xs ${customer.documents?.includes(d)
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}
                >
                  {customer.documents?.includes(d) ? 'Submitted' : 'Not submitted'}
                </span>
              </div>
            ))}
          </div>

          <p className="section-label mt-6">Activity history</p>

          <div className="mt-3 space-y-3">
            {(customer.activity || []).map((a, i) => (
              <div className="flex gap-3 text-sm" key={i}>
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />

                <div>
                  <b>{a.type}</b>
                  <p className="text-xs text-slate-400">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default App