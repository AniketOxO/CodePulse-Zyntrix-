import { useEffect, useState } from 'react';
import { snippetApi, Snippet } from '../services/api';
import { Plus, Trash2, Edit2, Search, X, Save, Code } from 'lucide-react';

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: 'javascript',
    description: '',
    tags: '',
  });

  const languages = ['javascript', 'typescript', 'python', 'java', 'css', 'html', 'shell', 'sql'];

  useEffect(() => {
    loadSnippets();
  }, [searchQuery, selectedLanguage]);

  const loadSnippets = async () => {
    try {
      setLoading(true);
      const data = await snippetApi.getAll({
        search: searchQuery || undefined,
        language: selectedLanguage || undefined,
      });
      setSnippets(data);
    } catch (error) {
      console.error('Failed to load snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingSnippet(null);
    setFormData({
      title: '',
      code: '',
      language: 'javascript',
      description: '',
      tags: '',
    });
    setShowModal(true);
  };

  const openEditModal = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setFormData({
      title: snippet.title,
      code: snippet.code,
      language: snippet.language,
      description: snippet.description,
      tags: snippet.tags.join(', '),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        title: formData.title,
        code: formData.code,
        language: formData.language,
        description: formData.description,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingSnippet) {
        await snippetApi.update(editingSnippet.id, data);
      } else {
        await snippetApi.create(data);
      }

      setShowModal(false);
      loadSnippets();
    } catch (error) {
      console.error('Failed to save snippet:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;
    try {
      await snippetApi.delete(id);
      loadSnippets();
    } catch (error) {
      console.error('Failed to delete snippet:', error);
    }
  };

  return (
    <div className="snippets-page">
      <div className="dashboard-heading">
        <div>
          <h1>Code Snippets</h1>
          <p>Save and organize useful code snippets from your projects.</p>
        </div>
        <button className="btn btn-primary btn-elevated" onClick={openCreateModal}>
          <Plus size={16} />
          New Snippet
        </button>
      </div>

      <div className="snippets-filters">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="snippets-summary">
        <article>
          <p>Total Snippets</p>
          <strong>{snippets.length}</strong>
        </article>
        <article>
          <p>Languages Used</p>
          <strong>{new Set(snippets.map((s) => s.language)).size}</strong>
        </article>
        <article>
          <p>Total Tags</p>
          <strong>{new Set(snippets.flatMap((s) => s.tags)).size}</strong>
        </article>
      </div>

      {loading ? (
        <div className="panel snippets-loading">Loading snippets...</div>
      ) : snippets.length === 0 ? (
        <div className="panel snippets-empty">
          <Code size={48} />
          <h3>No snippets found</h3>
          <p>Create your first code snippet to get started.</p>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={16} />
            Create Snippet
          </button>
        </div>
      ) : (
        <div className="snippets-grid">
          {snippets.map((snippet) => (
            <article key={snippet.id} className="panel snippet-card">
              <div className="snippet-header">
                <h3>{snippet.title}</h3>
                <div className="snippet-actions">
                  <button onClick={() => openEditModal(snippet)} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(snippet.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <span className="snippet-language">{snippet.language}</span>
              {snippet.description && <p className="snippet-desc">{snippet.description}</p>}
              <pre className="snippet-code">
                <code>{snippet.code}</code>
              </pre>
              {snippet.tags.length > 0 && (
                <div className="snippet-tags">
                  {snippet.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <small className="snippet-date">
                Updated: {new Date(snippet.updatedAt).toLocaleDateString()}
              </small>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSnippet ? 'Edit Snippet' : 'Create Snippet'}</h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                Title
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="My awesome snippet"
                  required
                />
              </label>
              <label>
                Language
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Description
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this snippet do?"
                />
              </label>
              <label>
                Code
                <textarea
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="// Your code here..."
                  rows={10}
                  required
                />
              </label>
              <label>
                Tags (comma-separated)
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="react, hooks, utility"
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-elevated">
                  <Save size={16} />
                  {editingSnippet ? 'Update' : 'Save'} Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
