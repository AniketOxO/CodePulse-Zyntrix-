import { useEffect, useState } from 'react';
import { templateApi, PromptTemplate } from '../services/api';
import { Plus, Trash2, Edit2, X, Save, FileText, Copy, Filter } from 'lucide-react';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    prompt: '',
    category: 'general',
    variables: '',
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = ['general', 'coding', 'writing', 'analysis', 'creative'];

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateApi.getAll(selectedCategory || undefined);
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTemplate(null);
    setFormData({
      name: '',
      prompt: '',
      category: 'general',
      variables: '',
    });
    setShowModal(true);
  };

  const openEditModal = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      prompt: template.prompt,
      category: template.category,
      variables: template.variables.join(', '),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        prompt: formData.prompt,
        category: formData.category,
        variables: formData.variables
          .split(',')
          .map((v) => v.trim())
          .filter(Boolean),
      };

      if (editingTemplate) {
        await templateApi.update(editingTemplate.id, data);
      } else {
        await templateApi.create(data);
      }

      setShowModal(false);
      loadTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await templateApi.delete(id);
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const copyPrompt = async (template: PromptTemplate) => {
    try {
      await navigator.clipboard.writeText(template.prompt);
      setCopiedId(template.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: '#6366f1',
      coding: '#22c55e',
      writing: '#f59e0b',
      analysis: '#3b82f6',
      creative: '#ec4899',
    };
    return colors[category] || '#6366f1';
  };

  return (
    <div className="templates-page">
      <div className="dashboard-heading">
        <div>
          <h1>Prompt Templates</h1>
          <p>Create and manage reusable prompt templates for common tasks.</p>
        </div>
        <button className="btn btn-primary btn-elevated" onClick={openCreateModal}>
          <Plus size={16} />
          New Template
        </button>
      </div>

      <div className="templates-filters">
        <div className="filter-box">
          <Filter size={16} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="templates-summary">
        <article>
          <p>Total Templates</p>
          <strong>{templates.length}</strong>
        </article>
        <article>
          <p>Categories Used</p>
          <strong>{new Set(templates.map((t) => t.category)).size}</strong>
        </article>
        <article>
          <p>With Variables</p>
          <strong>{templates.filter((t) => t.variables.length > 0).length}</strong>
        </article>
      </div>

      {loading ? (
        <div className="templates-loading">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="templates-empty panel">
          <FileText size={48} />
          <h3>No templates yet</h3>
          <p>Create your first prompt template to get started!</p>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={16} />
            Create Template
          </button>
        </div>
      ) : (
        <div className="templates-grid">
          {templates.map((template) => (
            <article key={template.id} className="panel template-card">
              <div className="template-header">
                <span
                  className="template-category"
                  style={{ backgroundColor: getCategoryColor(template.category) }}
                >
                  {template.category}
                </span>
                <div className="template-actions">
                  <button
                    onClick={() => copyPrompt(template)}
                    title={copiedId === template.id ? 'Copied!' : 'Copy prompt'}
                    className={copiedId === template.id ? 'copied' : ''}
                  >
                    <Copy size={14} />
                  </button>
                  <button onClick={() => openEditModal(template)} title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(template.id)} title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3>{template.name}</h3>
              <p className="template-prompt">{template.prompt}</p>
              {template.variables.length > 0 && (
                <div className="template-variables">
                  <small>Variables:</small>
                  <div className="variable-tags">
                    {template.variables.map((v) => (
                      <span key={v}>{`{{${v}}}`}</span>
                    ))}
                  </div>
                </div>
              )}
              <small className="template-date">
                Created {new Date(template.createdAt).toLocaleDateString()}
              </small>
            </article>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTemplate ? 'Edit Template' : 'New Template'}</h3>
              <button onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Name
                  <input
                    type="text"
                    placeholder="Template name..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Category
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Prompt Template
                <textarea
                  placeholder="Write your prompt template here. Use {{variable}} for placeholders..."
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  rows={6}
                  required
                />
              </label>
              <label>
                Variables (comma-separated)
                <input
                  type="text"
                  placeholder="e.g., topic, language, style"
                  value={formData.variables}
                  onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                />
              </label>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {editingTemplate ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
