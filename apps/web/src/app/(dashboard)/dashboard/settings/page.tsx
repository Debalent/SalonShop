'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Clock, CreditCard, Bell, Shield, Globe, Save, Camera, ExternalLink, CheckCircle } from 'lucide-react'

type Tab = 'profile' | 'hours' | 'payments' | 'notifications' | 'security'

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'profile',       label: 'Profile',       icon: User },
  { key: 'hours',         label: 'Hours',         icon: Clock },
  { key: 'payments',      label: 'Payments',      icon: CreditCard },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security',      label: 'Security',      icon: Shield },
]

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] as const

const DEFAULT_HOURS = DAYS.map((day, i) => ({
  day,
  is_open: i < 5,
  open_time: '09:00',
  close_time: '18:00',
}))

type HourEntry = typeof DEFAULT_HOURS[number]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)
  const [hours, setHours] = useState<HourEntry[]>(DEFAULT_HOURS)

  // Profile form
  const [profile, setProfile] = useState({
    first_name: 'Alex', last_name: 'Rivera',
    email: 'alex@salonshop.com', phone: '(310) 555-1234',
    bio: 'Certified colorist and precision cutter with 8 years of experience.',
    specialty: 'Color & Precision Cuts', instagram_handle: 'alexrivera.hair',
    website_url: '', timezone: 'America/Los_Angeles',
    booking_buffer: 15, advance_booking_days: 60, cancellation_hours: 24,
    deposit_required: true, deposit_percent: 25,
  })

  // Notification prefs
  const [notifs, setNotifs] = useState({
    email_booking_confirmed: true, sms_booking_confirmed: true,
    email_booking_reminder: true, sms_booking_reminder: false,
    email_payment_received: true, sms_payment_received: false,
    email_review_received: true,  sms_review_received: false,
    email_payout_sent: true,      sms_payout_sent: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const updateHour = (index: number, field: keyof HourEntry, value: string | boolean) => {
    setHours(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h))
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-surface-400 text-sm mt-0.5">Manage your account and business preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <nav className="lg:w-48 flex-shrink-0">
          <div className="card p-2 flex lg:flex-col gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full text-left ${
                  activeTab === key
                    ? 'bg-brand-500/15 text-brand-400'
                    : 'text-surface-400 hover:text-white hover:bg-surface-700/50'
                }`}
              >
                <Icon size={15} className="flex-shrink-0" />
                <span className="hidden sm:inline lg:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* ---- Profile ---- */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><User size={16} className="text-brand-400" /> Personal Info</h2>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-brand-500/20 flex items-center justify-center text-2xl font-bold text-brand-400">
                      {profile.first_name[0]}{profile.last_name[0]}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center text-white">
                      <Camera size={12} />
                    </button>
                  </div>
                  <div>
                    <p className="text-white font-medium">{profile.first_name} {profile.last_name}</p>
                    <p className="text-surface-500 text-sm">Solo Provider · Pro Plan</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'first_name', label: 'First Name' },
                    { key: 'last_name',  label: 'Last Name' },
                    { key: 'email',      label: 'Email', type: 'email' },
                    { key: 'phone',      label: 'Phone', type: 'tel' },
                    { key: 'specialty',  label: 'Specialty' },
                    { key: 'instagram_handle', label: 'Instagram Handle' },
                    { key: 'website_url', label: 'Website URL', type: 'url' },
                  ].map(({ key, label, type = 'text' }) => (
                    <div key={key}>
                      <label className="text-sm text-surface-400 mb-1 block">{label}</label>
                      <input
                        type={type}
                        value={(profile as Record<string, string | number | boolean>)[key] as string}
                        onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                        className="input-field w-full"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="text-sm text-surface-400 mb-1 block">Bio</label>
                    <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={3} className="input-field w-full resize-none" />
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Globe size={16} className="text-brand-400" /> Booking Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Buffer time between appointments (min)</label>
                    <input type="number" min={0} value={profile.booking_buffer} onChange={e => setProfile(p => ({ ...p, booking_buffer: parseInt(e.target.value) }))} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Advance booking window (days)</label>
                    <input type="number" min={1} value={profile.advance_booking_days} onChange={e => setProfile(p => ({ ...p, advance_booking_days: parseInt(e.target.value) }))} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Cancellation window (hours)</label>
                    <input type="number" min={0} value={profile.cancellation_hours} onChange={e => setProfile(p => ({ ...p, cancellation_hours: parseInt(e.target.value) }))} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="text-sm text-surface-400 mb-1 block">Timezone</label>
                    <select value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))} className="input-field w-full">
                      {['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','America/Phoenix'].map(tz => (
                        <option key={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-surface-800/50 flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-medium">Require deposit</div>
                    <div className="text-surface-500 text-xs">Clients pay a deposit to confirm their booking</div>
                  </div>
                  <button onClick={() => setProfile(p => ({ ...p, deposit_required: !p.deposit_required }))} className={`w-11 h-6 rounded-full transition-all ${profile.deposit_required ? 'bg-brand-500' : 'bg-surface-600'}`}>
                    <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${profile.deposit_required ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                {profile.deposit_required && (
                  <div className="mt-3">
                    <label className="text-sm text-surface-400 mb-1 block">Deposit % (of service price)</label>
                    <input type="number" min={1} max={100} value={profile.deposit_percent} onChange={e => setProfile(p => ({ ...p, deposit_percent: parseInt(e.target.value) }))} className="input-field w-32" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ---- Hours ---- */}
          {activeTab === 'hours' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Clock size={16} className="text-brand-400" /> Business Hours</h2>
              <div className="space-y-3">
                {hours.map((h, i) => (
                  <div key={h.day} className="flex items-center gap-4">
                    <div className="w-24 flex-shrink-0">
                      <button
                        onClick={() => updateHour(i, 'is_open', !h.is_open)}
                        className={`w-11 h-6 rounded-full transition-all ${h.is_open ? 'bg-brand-500' : 'bg-surface-600'}`}
                      >
                        <span className={`block w-4 h-4 bg-white rounded-full mx-1 transition-transform ${h.is_open ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                    <span className={`w-24 text-sm font-medium ${h.is_open ? 'text-white' : 'text-surface-600'}`}>{h.day.slice(0,3)}</span>
                    {h.is_open ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input type="time" value={h.open_time} onChange={e => updateHour(i, 'open_time', e.target.value)} className="input-field text-sm w-32" />
                        <span className="text-surface-500 text-sm">to</span>
                        <input type="time" value={h.close_time} onChange={e => updateHour(i, 'close_time', e.target.value)} className="input-field text-sm w-32" />
                      </div>
                    ) : (
                      <span className="text-surface-600 text-sm">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---- Payments ---- */}
          {activeTab === 'payments' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-1 flex items-center gap-2"><CreditCard size={16} className="text-brand-400" /> Stripe Connect</h2>
                <p className="text-surface-400 text-sm mb-4">Connect your Stripe account to receive payouts directly to your bank.</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                  <span className="text-green-300 text-sm font-medium">Stripe account connected and active</span>
                </div>
                <div className="flex gap-3">
                  <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2 text-sm">
                    Stripe Dashboard <ExternalLink size={13} />
                  </a>
                  <button className="btn-secondary text-sm text-coral-400 border-coral-500/20 hover:bg-coral-500/10">Disconnect</button>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-semibold text-white mb-4">Subscription Plan</h2>
                <div className="flex items-center justify-between p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
                  <div>
                    <div className="font-bold text-white">Pro Plan</div>
                    <div className="text-brand-400 text-sm">$29/month · Renews Dec 18, 2024</div>
                  </div>
                  <button className="btn-secondary text-sm">Manage Plan</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---- Notifications ---- */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Bell size={16} className="text-brand-400" /> Notification Preferences</h2>
              <div className="space-y-5">
                {([
                  { key: 'booking_confirmed', label: 'Booking Confirmed',   desc: 'When a client books an appointment' },
                  { key: 'booking_reminder',  label: 'Booking Reminder',    desc: '24h before each appointment' },
                  { key: 'payment_received',  label: 'Payment Received',    desc: 'When a payment is successfully processed' },
                  { key: 'review_received',   label: 'Review Received',     desc: 'When a client leaves you a review' },
                  { key: 'payout_sent',       label: 'Payout Sent',         desc: 'When funds are transferred to your bank' },
                ] as { key: string; label: string; desc: string }[]).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-white text-sm font-medium">{label}</div>
                      <div className="text-surface-500 text-xs">{desc}</div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {(['email', 'sms'] as const).map(ch => {
                        const k = `${ch}_${key}` as keyof typeof notifs
                        return (
                          <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={notifs[k]}
                              onChange={e => setNotifs(p => ({ ...p, [k]: e.target.checked }))}
                              className="w-4 h-4 accent-teal-500"
                            />
                            <span className="text-xs text-surface-400 uppercase">{ch}</span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---- Security ---- */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold text-white flex items-center gap-2"><Shield size={16} className="text-brand-400" /> Change Password</h2>
                {['Current Password','New Password','Confirm New Password'].map(label => (
                  <div key={label}>
                    <label className="text-sm text-surface-400 mb-1 block">{label}</label>
                    <input type="password" className="input-field w-full" placeholder="••••••••" />
                  </div>
                ))}
                <button className="btn-primary">Update Password</button>
              </div>
              <div className="card p-6">
                <h2 className="font-semibold text-white mb-3">Two-Factor Authentication</h2>
                <p className="text-surface-400 text-sm mb-4">Add an extra layer of security to your account.</p>
                <button className="btn-secondary">Enable 2FA</button>
              </div>
              <div className="card p-6 border-coral-500/20">
                <h2 className="font-semibold text-coral-400 mb-3">Danger Zone</h2>
                <p className="text-surface-400 text-sm mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button className="px-4 py-2 rounded-lg bg-coral-500/10 text-coral-400 border border-coral-500/20 hover:bg-coral-500/20 transition-colors text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          {activeTab !== 'security' && (
            <div className="flex items-center justify-end gap-3 pt-2">
              {saved && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-green-400 text-sm">
                  <CheckCircle size={14} /> Saved successfully
                </motion.span>
              )}
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save size={15} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
