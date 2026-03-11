import { useEffect, useState } from 'react';
import { chatApi, ChatSession, ChatMessage } from '../services/api';
import { Plus, Trash2, Edit2, X, Save, MessageSquare, Send } from 'lucide-react';

export default function ChatsPage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingChat, setEditingChat] = useState<ChatSession | null>(null);
  const [formData, setFormData] = useState({ title: '' });
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await chatApi.getAll();
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingChat(null);
    setFormData({ title: '' });
    setShowModal(true);
  };

  const openEditModal = (chat: ChatSession) => {
    setEditingChat(chat);
    setFormData({ title: chat.title });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChat) {
        await chatApi.update(editingChat.id, { title: formData.title });
      } else {
        await chatApi.create({ title: formData.title || 'New Chat', messages: [] });
      }
      setShowModal(false);
      loadChats();
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this chat?')) return;
    try {
      await chatApi.delete(id);
      if (selectedChat?.id === id) {
        setSelectedChat(null);
      }
      loadChats();
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const selectChat = async (chat: ChatSession) => {
    try {
      const fullChat = await chatApi.getById(chat.id);
      setSelectedChat(fullChat);
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedChat || !newMessage.trim()) return;
    try {
      const updatedMessages: ChatMessage[] = [
        ...selectedChat.messages,
        { role: 'user', content: newMessage.trim(), timestamp: new Date().toISOString() },
      ];
      const updated = await chatApi.update(selectedChat.id, { messages: updatedMessages });
      setSelectedChat(updated);
      setNewMessage('');
      loadChats();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chats-page">
      <div className="dashboard-heading">
        <div>
          <h1>Chat Sessions</h1>
          <p>Manage and view your saved chat conversations.</p>
        </div>
        <button className="btn btn-primary btn-elevated" onClick={openCreateModal}>
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="chats-summary">
        <article>
          <p>Total Chats</p>
          <strong>{chats.length}</strong>
        </article>
        <article>
          <p>Total Messages</p>
          <strong>{chats.reduce((sum, c) => sum + c.messages.length, 0)}</strong>
        </article>
        <article>
          <p>Last Updated</p>
          <strong>
            {chats.length > 0
              ? new Date(Math.max(...chats.map((c) => new Date(c.updatedAt).getTime()))).toLocaleDateString()
              : 'N/A'}
          </strong>
        </article>
      </div>

      <div className="chats-layout">
        <aside className="panel chats-list">
          <div className="panel-head">
            <h3>Conversations</h3>
            <MessageSquare size={18} />
          </div>
          {loading ? (
            <p className="chats-loading">Loading chats...</p>
          ) : chats.length === 0 ? (
            <p className="chats-empty">No chats yet. Create your first chat!</p>
          ) : (
            <ul>
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className={selectedChat?.id === chat.id ? 'active' : ''}
                  onClick={() => selectChat(chat)}
                >
                  <div className="chat-item-info">
                    <strong>{chat.title}</strong>
                    <small>{chat.messages.length} messages</small>
                  </div>
                  <div className="chat-item-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(chat);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="panel chat-view">
          {selectedChat ? (
            <>
              <div className="panel-head">
                <h3>{selectedChat.title}</h3>
                <small>Created {new Date(selectedChat.createdAt).toLocaleDateString()}</small>
              </div>
              <div className="chat-messages">
                {selectedChat.messages.length === 0 ? (
                  <p className="chat-empty-msg">No messages yet. Start the conversation!</p>
                ) : (
                  selectedChat.messages.map((msg, idx) => (
                    <div key={idx} className={`chat-message ${msg.role}`}>
                      <span className="chat-role">{msg.role === 'user' ? 'You' : 'Assistant'}</span>
                      <p>{msg.content}</p>
                      {msg.timestamp && (
                        <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                  <Send size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="chat-placeholder">
              <MessageSquare size={48} />
              <p>Select a chat to view messages</p>
            </div>
          )}
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingChat ? 'Edit Chat' : 'New Chat'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                Title
                <input
                  type="text"
                  placeholder="Chat title..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {editingChat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
