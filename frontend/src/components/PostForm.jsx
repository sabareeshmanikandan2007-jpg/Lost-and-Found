import { useState, useEffect } from 'react';
import { Upload, X, MapPin } from 'lucide-react';
import { CATEGORY_EMOJI } from '../data/demoItems';

const CATEGORIES = ['Electronics', 'Bags', 'Books', 'ID Cards', 'Wallet', 'Keys', 'Documents', 'Accessories', 'Other'];

const PostForm = ({ initialData, onSubmit, isLoading, type = 'Lost' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    type: type,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Electronics',
        location: initialData.location || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
        contactName: initialData.contactName || '',
        contactEmail: initialData.contactEmail || '',
        contactPhone: initialData.contactPhone || '',
        type: initialData.type || type,
      });

      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData, type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, imageFile);
  };

  const isEditing = !!initialData;
  const isLost = formData.type === 'Lost';
  const badgeClass = isLost ? 'bg-lost text-white' : 'bg-found text-black';
  
  return (
    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
      
      {/* ── LEFT: Form ── */}
      <form onSubmit={handleSubmit} className="w-full lg:w-[60%] space-y-8 bg-white brutal-border p-6 lg:p-10 shadow-[8px_8px_0_0_#000]">
        
        <div className="border-b-2 border-black pb-4 mb-6">
          <h2 className="text-3xl font-display font-black uppercase text-charcoal tracking-tighter">
            {isEditing ? 'UPDATE DETAILS' : `REPORT ${formData.type.toUpperCase()} ITEM`}
          </h2>
        </div>
        
        {/* Type Toggle */}
        {!isEditing && (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'Lost' }))}
              className={`flex-1 py-3 font-display font-black text-lg uppercase transition-all brutal-border shadow-[4px_4px_0_0_#000] ${
                formData.type === 'Lost' ? 'bg-lost text-white scale-[1.02]' : 'bg-white text-charcoal'
              }`}
            >
              LOST
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type: 'Found' }))}
              className={`flex-1 py-3 font-display font-black text-lg uppercase transition-all brutal-border shadow-[4px_4px_0_0_#000] ${
                formData.type === 'Found' ? 'bg-found text-black scale-[1.02]' : 'bg-white text-charcoal'
              }`}
            >
              FOUND
            </button>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-5">
          <div>
            <label className="label-text">Title</label>
            <input
              type="text"
              name="title"
              required
              maxLength={100}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Leather Wallet, iPhone 13..."
              className="brutal-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label-text">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="brutal-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em] bg-[right_10px_center] bg-no-repeat cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-text">Date</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="brutal-input"
              />
            </div>
          </div>

          <div>
            <label className="label-text">Location (Where it was {isLost ? 'lost' : 'found'})</label>
            <input
              type="text"
              name="location"
              required
              maxLength={200}
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Library, CS Block Lab 2..."
              className="brutal-input flex items-center"
            />
          </div>

          <div>
            <label className="label-text">Description</label>
            <textarea
              name="description"
              required
              maxLength={1000}
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide identifiable details, colors, marks..."
              className="brutal-input resize-none"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="pt-6 border-t-2 border-dashed border-black/20 space-y-5">
           <h3 className="font-display font-black text-xl uppercase tracking-widest text-charcoal/80 mb-2">Contact Details</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label-text">Your Name</label>
              <input type="text" name="contactName" required value={formData.contactName} onChange={handleChange} className="brutal-input" />
            </div>
            <div>
              <label className="label-text">Email</label>
              <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="brutal-input" />
            </div>
           </div>
           <div>
              <label className="label-text">Phone (Optional)</label>
              <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="brutal-input" placeholder="+91..." />
           </div>
        </div>

        {/* Image Upload */}
        <div className="pt-6 border-t-2 border-dashed border-black/20">
           <h3 className="font-display font-black text-xl uppercase tracking-widest text-charcoal/80 mb-2">Attach Photo</h3>
           <div className="relative border-4 border-dashed border-black bg-neutral h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              <Upload className="w-8 h-8 mb-2" strokeWidth={2.5}/>
              <span className="font-sans font-bold text-sm">CLICK TO UPLOAD IMAGE (JPG/PNG)</span>
           </div>
           
           {imagePreview && (
             <div className="mt-4 relative inline-block brutal-border p-1 bg-white shadow-[4px_4px_0_0_#000]">
               <img src={imagePreview} alt="Preview" className="h-24 w-auto object-cover" />
               <button 
                 type="button" 
                 onClick={() => { setImageFile(null); setImagePreview(null); }}
                 className="absolute -top-3 -right-3 bg-lost text-white rounded-full p-1 brutal-border shadow-[2px_2px_0_0_#000]"
               >
                 <X className="w-4 h-4" strokeWidth={3} />
               </button>
             </div>
           )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="brutal-btn-primary w-full h-14 text-xl tracking-widest mt-8 shadow-[6px_6px_0_0_#000]"
        >
          {isLoading ? 'SUBMITTING...' : `SUBMIT ${formData.type.toUpperCase()} ITEM →`}
        </button>
      </form>

      {/* ── RIGHT: Live Preview ── */}
      <div className="w-full lg:w-[40%] lg:sticky lg:top-24 slide-up">
        <h3 className="font-display font-black text-2xl uppercase tracking-tighter mb-4 text-charcoal">LIVE PREVIEW</h3>
        
        <div className="brutal-card group flex flex-col overflow-hidden max-w-sm">
          {/* Image */}
          <div className="w-full aspect-[4/3] brutal-border border-0 border-b-2 bg-neutral relative overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
               <span className="text-6xl opacity-50">{CATEGORY_EMOJI[formData.category] || '📦'}</span>
            )}
            
            <div className="absolute top-3 left-3">
              <span className={`badge ${badgeClass} shadow-sm !border-2 !border-black`}>
                {formData.type}
              </span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-5 flex flex-col flex-1 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{CATEGORY_EMOJI[formData.category] || '📌'}</span>
              <span className="text-sm font-bold font-sans text-charcoal/70 uppercase tracking-wide">
                {formData.category}
              </span>
            </div>
            
            <h3 className="text-xl font-display font-black leading-tight mb-3 line-clamp-2 text-charcoal">
              {formData.title || 'Your Title Here'}
            </h3>
            
            <div className="mt-auto space-y-2">
              <div className="flex items-start gap-2 text-[14px] text-charcoal font-bold">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={3} />
                <span className="line-clamp-1">{formData.location || 'Location will appear here'}</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    
    </div>
  );
};

export default PostForm;
