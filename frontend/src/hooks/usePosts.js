import { useState, useEffect, useCallback } from 'react';
import { getPosts, getStats } from '../services/api';

export const usePosts = (initialFilters = {}) => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0, resolved: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    type: 'All',
    status: 'All',
    sort: 'newest',
    page: 1,
    limit: 12,
    ...initialFilters,
  });

  const fetchPosts = useCallback(async (filterParams) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterParams.search) params.search = filterParams.search;
      if (filterParams.category && filterParams.category !== 'All') params.category = filterParams.category;
      if (filterParams.type && filterParams.type !== 'All') params.type = filterParams.type;
      if (filterParams.status && filterParams.status !== 'All') params.status = filterParams.status;
      if (filterParams.sort) params.sort = filterParams.sort;
      if (filterParams.page) params.page = filterParams.page;
      if (filterParams.limit) params.limit = filterParams.limit;

      const data = await getPosts(params);
      setPosts(data.posts || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await getStats();
      setStats(data.stats || { total: 0, lost: 0, found: 0, resolved: 0 });
    } catch (err) {
      console.error('Failed to fetch stats:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchPosts(filters);
  }, [filters, fetchPosts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const goToPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const refresh = useCallback(() => {
    fetchPosts(filters);
  }, [filters, fetchPosts]);

  return {
    posts,
    stats,
    loading,
    error,
    total,
    totalPages,
    currentPage,
    filters,
    updateFilters,
    goToPage,
    refresh,
    fetchStats,
  };
};

export default usePosts;
