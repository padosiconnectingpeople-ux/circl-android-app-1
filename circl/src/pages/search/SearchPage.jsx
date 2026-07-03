import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { Search, MapPin, Tag, Briefcase, FileText } from 'lucide-react';
import Avatar from '@components/common/Avatar';

const SearchPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState({ posts: [], businesses: [], issues: [] });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!queryText.trim()) return;
    setLoading(true);

    try {
      const area = profile?.area || 'Bandra';

      // 1. Search Businesses
      const bizSnap = await getDocs(
        query(collection(db, 'businesses'), where('area', '==', area))
      );
      const allBiz = bizSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const matchedBiz = allBiz.filter(b =>
        b.name.toLowerCase().includes(queryText.toLowerCase()) ||
        b.category.toLowerCase().includes(queryText.toLowerCase())
      );

      // 2. Search Issues
      const issuesSnap = await getDocs(
        query(collection(db, 'issues'), where('area', '==', area))
      );
      const allIssues = issuesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const matchedIssues = allIssues.filter(i =>
        i.title.toLowerCase().includes(queryText.toLowerCase()) ||
        i.description.toLowerCase().includes(queryText.toLowerCase())
      );

      setResults({
        posts: [], // Real queries would run firestore fulltext search
        businesses: matchedBiz,
        issues: matchedIssues,
      });
    } catch (err) {
      console.warn('Search query failed, returning fallback results');
    }

    setLoading(false);
  };

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search post keyword, shops, issues..."
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="input-field pl-10 h-12"
          autoFocus
        />
        <Search className="absolute left-3.5 top-4 w-4.5 h-4.5 text-text-muted" />
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center py-6 text-text-muted">{t('loading')}</div>
      ) : (
        <div className="space-y-6">
          {/* Businesses */}
          {results.businesses.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-on-surface text-body-lg flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-primary" /> Local Businesses
              </h3>
              <div className="space-y-2">
                {results.businesses.map((biz) => (
                  <div
                    key={biz.id}
                    onClick={() => navigate(`/directory/${biz.id}`)}
                    className="p-3 bg-surface-container-low border border-outline-variant/10 rounded-xl flex gap-3 cursor-pointer"
                  >
                    <Avatar name={biz.name} src={biz.logo} size="sm" />
                    <div>
                      <h4 className="font-bold text-on-surface text-body-md">{biz.name}</h4>
                      <span className="text-[10px] text-primary font-bold">{biz.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {results.issues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-on-surface text-body-lg flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" /> Active Issues
              </h3>
              <div className="space-y-2">
                {results.issues.map((issue) => (
                  <div
                    key={issue.id}
                    onClick={() => navigate('/issues')}
                    className="p-3 bg-surface-container-low border border-outline-variant/10 rounded-xl cursor-pointer"
                  >
                    <h4 className="font-bold text-on-surface text-body-md">{issue.title}</h4>
                    <p className="text-[11px] text-text-muted mt-1 leading-[1.3] line-clamp-2">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.businesses.length === 0 && results.issues.length === 0 && queryText && (
            <div className="text-center py-8 text-text-muted">No results found for "{queryText}"</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
