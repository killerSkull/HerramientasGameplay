import { useState } from 'react';
import { Trash2, Edit3, Edit2, Check, X, Search, Filter } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

function ClipsList({ 
  clips, 
  categories, 
  onRemoveClip, 
  onUpdateNote,
  onEditClip,
  sortBy = 'timestamp',
  onSortChange 
}) {
  const { theme } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const startEditing = (clip) => {
    setEditingId(clip.id);
    setEditNote(clip.note || '');
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateNote(editingId, editNote);
      setEditingId(null);
      setEditNote('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNote('');
  };

  // Filter and search clips
  const filteredClips = clips.filter(clip => {
    const matchesCategory = filterCategory === 'all' || clip.category.id === filterCategory;
    const matchesSearch = searchQuery === '' || 
      clip.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.category.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort clips
  const sortedClips = [...filteredClips].sort((a, b) => {
    switch (sortBy) {
      case 'category':
        return a.category.name.localeCompare(b.category.name);
      case 'timestamp':
      default:
        return a.timestamp - b.timestamp;
    }
  });

  return (
    <div className={`${theme.glass} rounded-2xl p-4 md:p-6`}>
      {/* Header with filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <h3 className={`text-lg font-semibold ${theme.text.primary} flex items-center gap-2`}>
          📋 Momentos Marcados 
          <span className={`px-2 py-0.5 text-sm ${theme.card} rounded-full`}>
            {clips.length}
          </span>
        </h3>

        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.text.muted}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className={`w-full md:w-40 pl-9 pr-3 py-1.5 rounded-lg ${theme.card} ${theme.text.primary} 
                placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50`}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className={`absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 ${theme.text.muted}`} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`pl-7 pr-3 py-1.5 rounded-lg ${theme.card} ${theme.text.primary} 
                text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 cursor-pointer`}
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clips List */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
        {sortedClips.length === 0 ? (
          <div className={`text-center py-8 ${theme.text.muted}`}>
            {clips.length === 0 
              ? '🎮 Los momentos que marques aparecerán aquí'
              : '🔍 No se encontraron clips'}
          </div>
        ) : (
          sortedClips.map((clip) => (
            <div
              key={clip.id}
              className={`group flex items-start gap-3 p-3 rounded-xl ${theme.card} 
                hover:bg-white/10 transition-colors`}
            >
              {/* Category Badge */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${clip.category.bgColor} 
                flex items-center justify-center text-xl shadow-md`}>
                {clip.category.emoji}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-semibold ${theme.text.secondary}`}>
                    {clip.timestampFormatted}
                  </span>
                  <span className={`text-sm ${theme.text.muted}`}>
                    {clip.category.name}
                  </span>
                </div>
                
                {editingId === clip.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Añadir nota..."
                      className={`flex-1 px-2 py-1 rounded ${theme.card} ${theme.text.primary} 
                        text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50`}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button
                      onClick={saveEdit}
                      className="p-1 text-green-400 hover:bg-green-400/20 rounded transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className={`text-sm ${clip.note ? theme.text.primary : theme.text.muted} truncate`}>
                    {clip.note || 'Sin nota'}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEditClip && (
                  <button
                    onClick={() => onEditClip(clip)}
                    className={`p-1.5 rounded-lg ${theme.card} hover:bg-purple-500/20 transition-colors`}
                    title="Editar clip"
                  >
                    <Edit2 className={`w-4 h-4 text-purple-400`} />
                  </button>
                )}
                <button
                  onClick={() => startEditing(clip)}
                  className={`p-1.5 rounded-lg ${theme.card} hover:bg-white/20 transition-colors`}
                  title="Editar nota"
                >
                  <Edit3 className={`w-4 h-4 ${theme.text.muted}`} />
                </button>
                <button
                  onClick={() => onRemoveClip(clip.id)}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-colors"
                  title="Eliminar clip"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClipsList;
