import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { getPost, updatePost } from '../services/api';
import { toast } from 'react-hot-toast';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPost(id);
        setPost(data.post);
      } catch (error) {
        toast.error('Failed to load post');
        navigate('/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (formData, imageFile) => {
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await updatePost(id, data);
      toast.success('Post updated successfully');
      navigate(`/posts/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="font-display font-black text-2xl uppercase tracking-widest animate-pulse text-charcoal">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8 pb-24">
       {/* Decorative brutalist strip */}
       <div className="w-full h-4 bg-charcoal brutal-border border-l-0 border-r-0 mb-8" />
       {post && (
        <PostForm
          initialData={post}
          onSubmit={handleSubmit}
          isLoading={submitting}
        />
      )}
    </div>
  );
};

export default EditPost;
