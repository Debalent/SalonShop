'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, Clock, DollarSign, ToggleLeft, ToggleRight, Star } from 'lucide-react'

type Service = {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
  deposit_percent: number
  is_popular: boolean
  is_active: boolean
  category: string
}

const INITIAL_SERVICES: Service[] = [
  { id: 's1', name: 'Balayage + Gloss',    description: 'Full balayage with a toning gloss finish.',                   duration_minutes: 180, price: 28000, deposit_percent: 25, is_popular: true,  is_active: true,  category: 'Color' },
  { id: 's2', name: 'Precision Haircut',   description: 'Dry cut tailored to your face shape and texture.',             duration_minutes: 60,  price: 8500,  deposit_percent: 0,  is_popular: true,  is_active: true,  category: 'Cut' },
  { id: 's3', name: 'Root Touch-up',       description: 'Single process root colour with shine treatment.',             duration_minutes: 90,  price: 12000, deposit_percent: 0,  is_popular: false, is_active: true,  category: 'Color' },
  { id: 's4', name: 'Curly Cut (Dry)',     description: 'DevaCurl-inspired dry cut for curly/coily textures.',          duration_minutes: 75,  price: 9500,  deposit_percent: 0,  is_popular: false, is_active: true,  category: 'Cut' },
  { id: 's5', name: 'Style & Blow-dry',    description: 'Shampoo, condition, and branded blow-dry finish.',             duration_minutes: 45,  price: 6000,  deposit_percent: 0,  is_popular: false, is_active: false, category: 'Style' },
]

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(cents / 100)
}
function formatDuration(min: number) {
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60), m = min % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

type FormState = { name: string; description: string; duration_minutes: number; price: number; deposit_percent: number; category: string; is_popular: boolean }
const DEFAULT_FORM: FormState = { name: '', description: '', duration_minutes: 60, price: 0, deposit_percent: 0, category: 'Cut', is_popular: false }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(DEFAULT_FORM)

  const openCreate = () => { setEditId(null); setForm(DEFAULT_FORM); setShowForm(true) }
  const openEdit = (s: Service) => { setEditId(s.id); setForm({ name: s.name, description: s.description, duration_minutes: s.duration_minutes, price: s.price, deposit_percent: s.deposit_percent, category: s.category, is_popular: s.is_popular }); setShowForm(true) }

  const handleSubmit = () => {
    if (!form.name.trim()) return
    if (editId) {
      setServices(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s))
    } else {
      setServices(prev => [...prev, { id: `s${Date.now()}`, ...form, is_active: true }])
    }
    setShowForm(false)
  }

  const toggleActive = (id: string) => setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s))
  const deleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id))

  const activeCount = services.filter(s => s.is_active).length

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Services</h1>
          <p className="text-surface-400 text-sm mt-0.5">{activeCount} active · {services.length - activeCount} hidden</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {/* Service List */}
      <div className="space-y-3">
        <AnimatePresence>
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className={`card p-5 transition-all ${!service.is_active ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{service.name}</h3>
                    {service.is_popular && (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-coral-500/20 text-coral-400 rounded text-xs">
                        <Star size={10} fill="currentColor" /> Popular
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 bg-surface-700/50 text-surface-500 rounded text-xs">{service.category}</span>
                  </div>
                  <p className="text-surface-400 text-sm mb-3">{service.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-brand-400 font-semibold">
                      <DollarSign size={13} />{formatCurrency(service.price)}
                    </span>
                    <span className="flex items-center gap-1 text-surface-400">
                      <Clock size={13} />{formatDuration(service.duration_minutes)}
                    </span>
                    {service.deposit_percent > 0 && (
                      <span className="text-surface-500 text-xs">{service.deposit_percent}% deposit</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleActive(service.id)} className={`transition-colors ${service.is_active ? 'text-brand-400 hover:text-brand-300' : 'text-surface-600 hover:text-surface-400'}`} title={service.is_active ? 'Hide service' : 'Show service'}>
                    {service.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => openEdit(service)} className="text-surface-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-surface-700/50">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteService(service.id)} className="text-surface-500 hover:text-coral-400 transition-colors p-1.5 rounded-lg hover:bg-coral-500/10">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="card p-6 w-full max-w-md space-y-4"
            >
              <h2 className="text-lg font-bold text-white">{editId ? 'Edit Service' : 'New Service'}</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-surface-400 mb-1 block">Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field w-full" placeholder="e.g. Balayage + Gloss" />
                </div>
                <div>
                  <label className="text-sm text-surface-400 mb-1 block">Description</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="input-field w-full resize-none" placeholder="Brief description…" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Price ($)</label>
                    <input type="number" value={form.price / 100} onChange={e => setForm(p => ({ ...p, price: Math.round(parseFloat(e.target.value || '0') * 100) }))} className="input-field w-full" min={0} step={0.01} />
                  </div>
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Duration (min)</label>
                    <input type="number" value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: parseInt(e.target.value || '0') }))} className="input-field w-full" min={5} step={5} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Deposit %</label>
                    <input type="number" value={form.deposit_percent} onChange={e => setForm(p => ({ ...p, deposit_percent: parseInt(e.target.value || '0') }))} className="input-field w-full" min={0} max={100} />
                  </div>
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Category</label>
                    <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field w-full">
                      {['Cut','Color','Style','Nails','Brows','Skin','Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_popular} onChange={e => setForm(p => ({ ...p, is_popular: e.target.checked }))} className="w-4 h-4 accent-teal-500" />
                  <span className="text-sm text-surface-300">Mark as Popular</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary flex-1">{editId ? 'Save Changes' : 'Add Service'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
