import { Link } from 'react-router-dom';
import { MapPin, Calendar, User } from 'lucide-react';
import { getItemImageUrl, CATEGORY_EMOJI } from '../data/demoItems';

const PostCard = ({ post }) => {
  const isLost = post.type === 'Lost';
  const isResolved = post.status === 'Resolved';
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Real images logic from demo items fallback strategy
  const imgSrc = getItemImageUrl(post);
  const fallbackEmoji = CATEGORY_EMOJI[post.category] || '📦';

  let badgeClass = 'bg-white text-black';
  if (isResolved) {
    badgeClass = 'badge-resolved';
  } else if (isLost) {
    badgeClass = 'badge-lost';
  } else {
    badgeClass = 'badge-found';
  }

  return (
    <div className="brutal-card group flex flex-col h-full hover:-translate-y-1 transition-transform overflow-hidden relative">
      {/* Image container 4:3 */}
      <div className="w-full aspect-[4/3] brutal-border border-0 border-b-2 bg-neutral relative overflow-hidden flex items-center justify-center">
        {imgSrc ? (
           <img 
             src={imgSrc} 
             alt={post.title} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
             onError={(e) => {
               e.target.style.display = 'none';
               // Fallback visually if image fails loading natively without infinite loop
               e.target.nextSibling.style.display = 'flex';
             }}
           />
        ) : null}
        
        {/* Fallback Emoji Box */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-sage/20" 
          style={{ display: !imgSrc ? 'flex' : 'none' }}
        >
          <span className="text-6xl opacity-50">{fallbackEmoji}</span>
        </div>

        {/* Fallback Banana Image */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-primary" 
          style={{ display: !imgSrc ? 'flex' : 'none' }}
        >
          <img src="/demo-items/banana.png" alt="Missing item banana" className="w-full h-full object-cover opacity-80" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`badge ${badgeClass} shadow-sm`}>
            {isResolved ? '✓ Resolved' : post.type}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{CATEGORY_EMOJI[post.category] || '📌'}</span>
          <span className="text-sm font-bold font-sans text-charcoal/70 uppercase tracking-wide">
            {post.category}
          </span>
        </div>
        
        <h3 className="text-xl font-display font-bold leading-tight mb-3 line-clamp-2 text-charcoal">
          {post.title}
        </h3>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-start gap-2 text-[14px] text-charcoal font-medium">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={2.5} />
            <span className="line-clamp-1">{post.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[14px] text-charcoal font-medium">
            <Calendar className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-[14px] text-charcoal font-medium pt-2 border-t-2 border-black/10 mt-2">
            <User className="w-4 h-4 shrink-0" strokeWidth={2.5} />
            <span className="line-clamp-1 truncate">{post.contactName}</span>
          </div>
        </div>
        
        <Link 
          to={`/posts/${post._id}`}
          className="brutal-btn mt-5 w-full bg-charcoal text-white hover:bg-black py-2.5 text-sm"
        >
          VIEW DETAILS →
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
