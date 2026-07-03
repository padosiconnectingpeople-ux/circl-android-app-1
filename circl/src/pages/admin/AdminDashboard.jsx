import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { ArrowLeft, Shield, Users, Award, TrendingUp, Check, X, ShieldAlert } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Mon', Users: 120, Posts: 12 },
  { name: 'Tue', Users: 140, Posts: 19 },
  { name: 'Wed', Users: 190, Posts: 34 },
  { name: 'Thu', Users: 230, Posts: 45 },
  { name: 'Fri', Users: 310, Posts: 56 },
  { name: 'Sat', Users: 340, Posts: 89 },
  { name: 'Sun', Users: 400, Posts: 110 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Demo Verification Requests
  const demoRequests = [
    {
      id: 'req_1',
      name: 'Rohan Sharma',
      society: 'Sunshine Apartments',
      flatNumber: 'B-402',
      role: 'resident',
      photoURL: '',
    },
    {
      id: 'req_2',
      name: 'Karan Malhotra',
      society: 'Sunshine Apartments',
      flatNumber: 'A-108',
      role: 'resident',
      photoURL: '',
    }
  ];

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('society', '==', profile?.society || 'Sunshine Apts'),
          where('verified', '==', false)
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (docs.length > 0) {
          setRequests(docs);
        } else {
          setRequests(demoRequests);
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback requests:', e);
        setRequests(demoRequests);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [profile]);

  const handleVerify = async (uid, approve) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        verified: approve,
      });
    } catch (e) {
      console.warn('Firestore update failed, doing local update only');
    }

    setRequests(prev => prev.filter(r => r.id !== uid));
  };

  return (
    <div className="animate-fade-in p-md space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-headline-sm font-bold text-on-surface">Society Admin Controls</h2>
            <span className="text-[10px] text-text-muted font-bold block">
              Manage {profile?.society || 'Sunshine Apartments'}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 space-y-1">
          <div className="flex items-center justify-between text-primary">
            <Users className="w-5 h-5" />
            <span className="text-label-sm font-bold text-success">+14%</span>
          </div>
          <h4 className="text-headline-sm font-extrabold text-on-surface">450</h4>
          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">
            Total Residents
          </span>
        </div>
        <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 space-y-1">
          <div className="flex items-center justify-between text-secondary">
            <TrendingUp className="w-5 h-5" />
            <span className="text-label-sm font-bold text-success">+28%</span>
          </div>
          <h4 className="text-headline-sm font-extrabold text-on-surface">89%</h4>
          <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">
            Active Feed DAU
          </span>
        </div>
      </div>

      {/* Recharts Analytics Chart */}
      <div className="bg-card border border-outline-variant/10 p-md rounded-2xl space-y-3">
        <h3 className="font-bold text-on-surface text-body-lg">Resident Engagement Trend</h3>
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#6B7280" fontSize={11} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="Users" stroke="#5B4FE8" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Posts" stroke="#FF6B35" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Verification requests */}
      <div className="space-y-3">
        <h3 className="font-bold text-on-surface text-body-lg flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-primary" /> Pending Verifications
        </h3>

        {loading ? (
          <div className="text-center py-4 text-text-muted">{t('loading')}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <p className="text-label-md text-text-muted">No pending verification requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="p-3 bg-card border border-outline-variant/10 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={req.name} src={req.photoURL} size="md" />
                  <div>
                    <h4 className="font-bold text-on-surface text-body-md">{req.name}</h4>
                    <span className="text-[10px] text-text-muted font-bold block mt-0.5">
                      Flat: {req.flatNumber || 'RWA Staff'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleVerify(req.id, true)}
                    className="w-8 h-8 rounded-lg bg-green-50 text-success hover:bg-green-100 flex items-center justify-center transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleVerify(req.id, false)}
                    className="w-8 h-8 rounded-lg bg-red-50 text-danger hover:bg-red-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
