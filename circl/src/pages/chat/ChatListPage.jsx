import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@components/common/Avatar';
import useTranslation from '@i18n/useTranslation';
import useAuthStore from '@store/authStore';
import { ArrowLeft, MessageSquare, Shield, Users } from 'lucide-react';

const ChatListPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  // Demo active group chats and direct messages
  const chats = [
    {
      id: 'soc_group',
      name: `${profile?.society || 'Sunshine'} Society Chat`,
      type: 'group',
      lastMessage: 'Security timing will be updated from tomorrow.',
      unread: true,
      iconType: 'society',
      time: '11:03 AM',
    },
    {
      id: 'col_group',
      name: `${profile?.colony || 'Hill View'} Colony Group`,
      type: 'group',
      lastMessage: 'Plantation drive starts at 8:30 AM this Saturday.',
      unread: false,
      iconType: 'colony',
      time: 'Yesterday',
    },
    {
      id: 'dm_1',
      name: 'Priya Sharma',
      type: 'dm',
      lastMessage: 'Yes, I will bring the yoga mats.',
      unread: false,
      time: '2 days ago',
    }
  ];

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <h2 className="text-headline-sm font-bold text-on-surface flex-1">{t('chat')} Discussions</h2>
      </div>

      {/* Chat Lists */}
      <div className="divide-y divide-outline-variant/10">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="flex items-center gap-3 py-3.5 cursor-pointer hover:bg-surface-container-low active:bg-surface-container transition-all"
          >
            {/* Custom Icon / Avatar */}
            {chat.iconType === 'society' ? (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Shield className="w-6 h-6" />
              </div>
            ) : chat.iconType === 'colony' ? (
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <Users className="w-6 h-6" />
              </div>
            ) : (
              <Avatar name={chat.name} size="lg" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h4 className="font-bold text-on-surface text-body-lg truncate">{chat.name}</h4>
                <span className="text-[10px] text-text-muted shrink-0">{chat.time}</span>
              </div>
              <p className={`text-body-md truncate mt-0.5 ${chat.unread ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                {chat.lastMessage}
              </p>
            </div>

            {chat.unread && (
              <div className="w-2.5 h-2.5 bg-primary rounded-full shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListPage;
