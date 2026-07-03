import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import Avatar from '@components/common/Avatar';
import { ArrowLeft, Send, Shield, Users } from 'lucide-react';

const ChatRoomPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Default Mock Messages if Firestore has no contents
  const demoMessages = [
    { id: '1', senderName: 'Priya Sharma', text: 'Hey guys, yoga class will start tomorrow at 6:30 AM rooftop.', createdAt: new Date() },
    { id: '2', senderName: 'Rahul Malhotra', text: 'Great, see you all there!', createdAt: new Date() }
  ];

  useEffect(() => {
    const messagesRef = collection(db, 'chatGroups', groupId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (docs.length > 0) {
        setMessages(docs);
      } else {
        setMessages(demoMessages);
      }
    }, (error) => {
      console.warn('Real-time database fetch failed, loading dummy messages');
      setMessages(demoMessages);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const msgData = {
      senderId: user?.uid || 'guest',
      senderName: profile?.name || 'Neighbor',
      senderPhoto: profile?.photoURL || '',
      text: inputText,
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, msgData]);
    setInputText('');

    try {
      await addDoc(collection(db, 'chatGroups', groupId, 'messages'), {
        ...msgData,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Failed to upload message to Firestore, only updated locally');
    }
  };

  return (
    <div className="animate-fade-in h-screen flex flex-col justify-between max-w-lg mx-auto bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3 p-md shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <div className="flex items-center gap-2">
          {groupId.includes('soc') ? (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Users className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="font-bold text-on-surface text-body-lg capitalize">
              {groupId.includes('soc') ? 'Society Group Chat' : 'Colony Group Chat'}
            </h3>
            <span className="text-[10px] text-text-muted font-bold block">Active Discussions</span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 p-md hide-scrollbar">
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.uid;
          return (
            <div key={msg.id} className={`flex flex-col max-w-[80%] ${isOwn ? 'ml-auto items-end' : 'mr-auto'}`}>
              <span className="text-[10px] text-text-muted mb-0.5 px-1">{msg.senderName}</span>
              <div className={`p-3 rounded-2xl text-body-md ${
                isOwn
                  ? 'bg-primary text-on-primary rounded-tr-none'
                  : 'bg-surface-container-low border border-outline-variant/10 text-on-surface rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap leading-[1.3]">{msg.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 shrink-0 border-t border-outline-variant/10 pt-3 p-md pb-safe">
        <input
          type="text"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="input-field flex-1"
        />
        <button
          onClick={handleSend}
          className="w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPage;
