import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import { createPost } from '../services/api';
import { toast } from 'react-hot-toast';

const CreatePost = () => {
  const [searchParams] = useSearchParams();
  const initType = searchParams.get('type') === 'Found' ? 'Found' : 'Lost';
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData, imageFile) => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append('image', imageFile);
      }

      await createPost(data);
      toast.success(`${formData.type} item reported successfully.`);
      navigate('/browse');
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 pb-24">
      {/* Decorative brutalist strip */}
      <div className="w-full h-4 bg-primary brutal-border border-l-0 border-r-0 mb-8" />
      <PostForm onSubmit={handleSubmit} isLoading={loading} type={initType} />
    </div>
  );
};

export default CreatePost;
