// Export utilities

import { formatTime, formatDateShort } from './formatters';

/**
 * Export session data as JSON
 */
export function exportToJSON(session) {
  const exportData = {
    metadata: {
      appVersion: '1.0.0',
      exportedBy: 'ClipMarker',
      exportedAt: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    session: {
      id: session.id,
      name: session.name,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.duration,
      durationFormatted: formatTime(session.duration),
      totalClips: session.clips.length
    },
    clips: session.clips.map(clip => ({
      id: clip.id,
      timestamp: clip.timestamp,
      timestampFormatted: clip.timestampFormatted,
      category: clip.category.name,
      categoryId: clip.category.id,
      emoji: clip.category.emoji,
      note: clip.note || '',
      createdAt: clip.createdAt
    }))
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Export clips as YouTube timestamps
 */
export function exportToYouTube(session, options = {}) {
  const {
    includeEmojis = true,
    includeNotes = true,
    includeHeader = true
  } = options;
  
  const sortedClips = [...session.clips].sort((a, b) => a.timestamp - b.timestamp);
  
  let output = '';
  
  if (includeHeader) {
    output += `⏱️ Timestamps - ${session.name}\n\n`;
  }
  
  sortedClips.forEach(clip => {
    const emoji = includeEmojis ? `${clip.category.emoji} ` : '';
    const note = includeNotes && clip.note ? ` - ${clip.note}` : '';
    output += `${clip.timestampFormatted} - ${emoji}${clip.category.name}${note}\n`;
  });
  
  return output.trim();
}

/**
 * Export clips as CSV
 */
export function exportToCSV(session) {
  const headers = ['Timestamp', 'Tiempo', 'Categoría', 'Emoji', 'Nota', 'Creado'];
  const rows = session.clips.map(clip => [
    clip.timestamp,
    clip.timestampFormatted,
    clip.category.name,
    clip.category.emoji,
    `"${(clip.note || '').replace(/"/g, '""')}"`,
    clip.createdAt
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Download content as file
 */
export function downloadFile(content, filename, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}
