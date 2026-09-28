import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, User, Mail, Phone, 
  Trash2, CheckCircle2, LayoutGrid
} from 'lucide-react';
import { getPost, deletePost, resolvePost } from '../services/api';
import { getItemImageUrl, CATEGORY_EMOJI } from '../data/demoItems';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const PostDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPost(id);
      setPost(data.post);
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deletePost(id);
      toast.success('Record successfully deleted.');
      navigate('/browse');
    } catch (err) {
      toast.error(err.message || 'Failed to delete record.');
      setActionLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleResolve = async () => {
    setActionLoading(true);
    try {
      const data = await resolvePost(id);
      setPost(data.post);
      toast.success('Item successfully returned/resolved.');
      setShowResolveConfirm(false);
    } catch (err) {
      toast.error(err.message || 'Failed to resolve item.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="font-display font-black text-2xl uppercase tracking-widest animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-4xl font-display font-black uppercase text-lost mb-4">Error loading post</h2>
        <p className="font-sans font-bold text-charcoal">{error || 'Post not found'}</p>
        <Link to="/browse" className="brutal-btn-primary mt-8">BACK TO BROWSE</Link>
      </div>
    );
  }

  const { title, description, type, category, location, date, contactName, contactEmail, contactPhone, status, createdAt, createdBy, isDemo } = post;
  
  // Ownership check
  const canManage = user && (createdBy === user.id || isDemo);

  const isLost = type === 'Lost';
  const isResolved = status === 'Resolved';
  const formattedDate = new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedCreated = new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const imgSrc = getItemImageUrl(post);
  const fallbackEmoji = CATEGORY_EMOJI[category] || '📦';

  return (
    <div className="py-8 pb-24">
      {/* Back button */}
      <Link to="/browse" className="inline-flex items-center font-display font-black text-charcoal hover:text-white hover:bg-charcoal px-3 py-1 mb-8 brutal-border transition-colors uppercase cursor-pointer">
        <ArrowLeft className="w-5 h-5 mr-1" strokeWidth={3} /> BACK
      </Link>

      {/* Hero Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <span className={`badge text-sm lg:text-base px-4 py-1.5 shadow-[2px_2px_0_0_#000] !border-2 ${isResolved ? 'badge-resolved' : isLost ? 'badge-lost' : 'badge-found'}`}>
            {isResolved ? '✓ RESOLVED' : type.toUpperCase()}
          </span>
          <span className="bg-white text-charcoal brutal-border px-4 py-1.5 font-display font-bold text-sm lg:text-base uppercase shadow-[2px_2px_0_0_#000]">
            {CATEGORY_EMOJI[category]} {category}
          </span>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-display font-black leading-tight uppercase tracking-tighter text-charcoal mb-4">
          {title}
        </h1>
        <p className="text-base font-bold font-sans text-charcoal/60">
          Posted on {formattedCreated} by {contactName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COL: Image */}
        <div className="lg:col-span-7">
          <div className="bg-neutral brutal-border shadow-[12px_12px_0_0_#000] w-full aspect-video sm:aspect-square lg:aspect-[4/3] flex items-center justify-center relative overflow-hidden group p-2">
             <div className="w-full h-full brutal-border bg-white overflow-hidden relative flex items-center justify-center">
               {imgSrc ? (
                 <img 
                   src={imgSrc} 
                   alt={title} 
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     e.target.style.display = 'none';
                     e.target.nextSibling.style.display = 'flex';
                   }}
                 />
               ) : null}
               
               <div 
                 className="absolute inset-0 flex items-center justify-center bg-sage/20" 
                 style={{ display: !imgSrc ? 'flex' : 'none' }}
               >
                 <span className="text-9xl opacity-50">{fallbackEmoji}</span>
               </div>
             </div>
          </div>
        </div>

        {/* RIGHT COL: Details */}
        <div className="lg:col-span-5 space-y-8 mt-4 lg:mt-0">
          
          {/* Action Bar (Top) */}
          {canManage && (
            <div className="bg-primary brutal-border p-6 shadow-[6px_6px_0_0_#000] relative">
              <h3 className="font-display font-black text-xl mb-4 border-b-2 border-black pb-2 uppercase">Manage Post</h3>
              <div className="flex flex-wrap gap-3">
                {!isResolved && (
                  <>
                    <button onClick={() => setShowResolveConfirm(true)} className="brutal-btn bg-charcoal text-white hover:bg-black p-2 flex-1 text-sm">
                      MARK RESOLVED
                    </button>
                  </>
                )}
                <button onClick={() => setShowDeleteConfirm(true)} className="brutal-btn bg-white text-lost hover:bg-lost hover:text-white p-2 flex-1 text-sm text-center">
                  DELETE ITEM
                </button>
              </div>
            </div>
          )}

          {/* Alert if resolved */}
          {isResolved && (
            <div className="bg-sage brutal-border p-6 text-charcoal shadow-[6px_6px_0_0_#000]">
              <div className="flex items-center gap-3 border-b-2 border-charcoal/20 pb-4 mb-4">
                <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                <h3 className="font-display font-black text-2xl uppercase">Returned</h3>
              </div>
              <p className="font-sans font-bold text-sm">This item has been successfully reunited with its owner.</p>
            </div>
          )}

          {/* INFO CARD */}
          <div className="bg-white brutal-border p-6 shadow-[6px_6px_0_0_#000] space-y-6">
             
             <div>
               <h4 className="font-display font-black text-lg text-charcoal/50 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <LayoutGrid className="w-4 h-4"/> Description
               </h4>
               <p className="font-sans font-medium text-lg leading-relaxed text-charcoal whitespace-pre-line">
                 {description}
               </p>
             </div>

             <div className="pt-6 border-t-2 border-black">
               <h4 className="font-display font-black text-lg text-charcoal/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <MapPin className="w-4 h-4"/> Where & When
               </h4>
               <div className="space-y-3 font-sans font-bold text-charcoal">
                 <div className="flex gap-4">
                   <div className="w-8 h-8 bg-neutral brutal-border flex items-center justify-center shrink-0">📍</div>
                   <p className="pt-1">{location}</p>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-8 h-8 bg-neutral brutal-border flex items-center justify-center shrink-0">🗓️</div>
                   <p className="pt-1">{formattedDate}</p>
                 </div>
               </div>
             </div>

             <div className="pt-6 border-t-2 border-black">
               <h4 className="font-display font-black text-lg text-charcoal/50 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <User className="w-4 h-4"/> Contact Details
               </h4>
               
               {isResolved ? (
                 <div className="bg-neutral border-2 border-black/20 border-dashed p-4 text-center">
                   <p className="font-sans font-bold text-charcoal/60">Contact details hidden for resolved items.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   <div className="bg-primary/20 p-4 border-2 border-primary">
                     <p className="font-bold text-lg">{contactName}</p>
                     
                     <div className="mt-4 space-y-2">
                       <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-charcoal hover:text-black font-medium transition-colors">
                         <Mail className="w-4 h-4 text-primary" strokeWidth={3} /> {contactEmail}
                       </a>
                       {contactPhone && (
                         <a href={`tel:${contactPhone}`} className="flex items-center gap-2 text-charcoal hover:text-black font-medium transition-colors">
                           <Phone className="w-4 h-4 text-primary" strokeWidth={3} /> {contactPhone}
                         </a>
                       )}
                     </div>
                   </div>
                 </div>
               )}
             </div>

          </div>
        </div>
      </div>

      {/* Confirm Modals */}
      <ConfirmDialog
        isOpen={showResolveConfirm}
        title="Mark Item as Resolved?"
        message="Are you sure you want to mark this item as resolved? This typically means the item has been successfully returned."
        confirmText="RESOLVE ITEM"
        onConfirm={handleResolve}
        onCancel={() => setShowResolveConfirm(false)}
        isLoading={actionLoading}
        type="success"
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Item Record?"
        message="Are you sure you want to permanently delete this post? This action cannot be undone."
        confirmText="DELETE PERMANENTLY"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={actionLoading}
        type="danger"
      />
    </div>
  );
};

export default PostDetailsPage;
