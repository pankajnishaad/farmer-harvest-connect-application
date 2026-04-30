import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input, Select, Textarea, Button, PageHeader } from '../../components/common/UI';
import { HiOutlineTruck, HiOutlineUsers, HiOutlineLocationMarker, HiOutlineCalendar } from 'react-icons/hi';
import { GiWheat } from 'react-icons/gi';

const VEHICLE_TYPES  = ['Truck (5 Ton)', 'Truck (10 Ton)', 'Tractor + Trailer', 'Mini Truck (2 Ton)', 'Combine Harvester', 'Tempo'];
const CROP_TYPES     = ['Wheat', 'Rice / Paddy', 'Soybean', 'Corn / Maize', 'Cotton', 'Sugarcane', 'Onion', 'Potato', 'Pulses'];
const DURATION_UNITS = ['Days', 'Weeks'];

const initialForm = {
  vehicleType: '', manpowerRequired: '', cropType: '',
  quantity: '', unit: 'Quintal', duration: '', durationUnit: 'Days',
  location: '', notes: '', urgency: 'normal',
};

export default function PostHarvest() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [posted, setPosted] = useState([]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.vehicleType)  e.vehicleType  = 'Select vehicle type';
    if (!form.cropType)     e.cropType     = 'Select crop type';
    if (!form.quantity)     e.quantity     = 'Enter quantity';
    if (!form.duration)     e.duration     = 'Enter duration';
    if (!form.location.trim()) e.location  = 'Enter location';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setPosted(p => [{ ...form, id: Date.now(), date: new Date().toLocaleDateString() }, ...p]);
    toast.success('Harvest requirement posted! Service providers will start bidding shortly. 🚜');
    setForm(initialForm);
    setErrors({});
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Post Harvest Requirement"
        subtitle="Describe your harvest logistics needs. Qualified service providers will bid on your requirement."
      />

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Vehicle Type */}
          <div>
            <label className="form-label flex items-center gap-1.5"><HiOutlineTruck className="text-forest-600" /> Vehicle Type</label>
            <select className={`form-select ${errors.vehicleType ? 'border-red-400' : ''}`} value={form.vehicleType} onChange={set('vehicleType')}>
              <option value="">Select vehicle type</option>
              {VEHICLE_TYPES.map(v => <option key={v}>{v}</option>)}
            </select>
            {errors.vehicleType && <p className="form-error">{errors.vehicleType}</p>}
          </div>

          {/* Manpower */}
          <div>
            <label className="form-label flex items-center gap-1.5"><HiOutlineUsers className="text-forest-600" /> Manpower Required</label>
            <input
              className="form-input"
              type="number"
              min="0"
              placeholder="Number of labourers (0 if not needed)"
              value={form.manpowerRequired}
              onChange={set('manpowerRequired')}
            />
          </div>

          {/* Crop Type */}
          <div>
            <label className="form-label flex items-center gap-1.5"><GiWheat className="text-forest-600" /> Crop Type</label>
            <select className={`form-select ${errors.cropType ? 'border-red-400' : ''}`} value={form.cropType} onChange={set('cropType')}>
              <option value="">Select crop type</option>
              {CROP_TYPES.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.cropType && <p className="form-error">{errors.cropType}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="form-label">Quantity</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Amount"
                value={form.quantity}
                onChange={set('quantity')}
                className={`form-input flex-1 ${errors.quantity ? 'border-red-400' : ''}`}
              />
              <select className="form-select w-28" value={form.unit} onChange={set('unit')}>
                <option>Quintal</option>
                <option>Ton</option>
                <option>Kg</option>
                <option>Acre</option>
              </select>
            </div>
            {errors.quantity && <p className="form-error">{errors.quantity}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="form-label flex items-center gap-1.5"><HiOutlineCalendar className="text-forest-600" /> Duration Required</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Number"
                value={form.duration}
                onChange={set('duration')}
                className={`form-input flex-1 ${errors.duration ? 'border-red-400' : ''}`}
              />
              <select className="form-select w-28" value={form.durationUnit} onChange={set('durationUnit')}>
                {DURATION_UNITS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            {errors.duration && <p className="form-error">{errors.duration}</p>}
          </div>

          {/* Urgency */}
          <div>
            <label className="form-label">Urgency</label>
            <select className="form-select" value={form.urgency} onChange={set('urgency')}>
              <option value="normal">Normal (within 1 week)</option>
              <option value="urgent">Urgent (2-3 days)</option>
              <option value="immediate">Immediate (today)</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="form-label flex items-center gap-1.5"><HiOutlineLocationMarker className="text-forest-600" /> Location / Farm Address</label>
          <input
            className={`form-input ${errors.location ? 'border-red-400' : ''}`}
            placeholder="Village, Tehsil, District, State (e.g. Sanwer, Indore, Madhya Pradesh)"
            value={form.location}
            onChange={set('location')}
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="form-label">Additional Notes (Optional)</label>
          <textarea
            className="form-input resize-none"
            rows={3}
            placeholder="Any special requirements, access instructions, or other details..."
            value={form.notes}
            onChange={set('notes')}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading} className="flex-1">
            📋 Post Harvest Requirement
          </Button>
          <button
            type="button"
            onClick={() => { setForm(initialForm); setErrors({}); }}
            className="btn-ghost px-6"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Posted Requirements */}
      {posted.length > 0 && (
        <div className="card">
          <h3 className="font-display font-bold text-gray-900 mb-4">Your Posted Requirements</h3>
          <div className="space-y-3">
            {posted.map(p => (
              <div key={p.id} className="flex items-start justify-between p-4 bg-forest-50 rounded-xl border border-forest-100">
                <div>
                  <p className="font-semibold text-gray-800">{p.cropType} · {p.quantity} {p.unit}</p>
                  <p className="text-sm text-gray-500">{p.vehicleType} · {p.duration} {p.durationUnit} · {p.location}</p>
                  <p className="text-xs text-gray-400 mt-1">Posted on {p.date}</p>
                </div>
                <span className="badge badge-green">Active</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
