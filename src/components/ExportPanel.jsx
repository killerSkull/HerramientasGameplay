import { useState } from 'react';
import { Download, Copy, FileJson, Youtube, Check, FileText } from 'lucide-react';
import { exportToJSON, exportToYouTube, exportToCSV, downloadFile, copyToClipboard } from '../utils/exporters';
import { useTheme } from '../ThemeProvider';

function ExportPanel({ session, onNotify }) {
  const { theme } = useTheme();
  const [copiedType, setCopiedType] = useState(null);

  const handleExportJSON = () => {
    const content = exportToJSON(session);
    const filename = `${session.name.replace(/\s+/g, '_')}_clips.json`;
    downloadFile(content, filename, 'application/json');
    onNotify?.('📥 JSON exportado exitosamente');
  };

  const handleExportYouTube = async () => {
    const content = exportToYouTube(session);
    const filename = `${session.name.replace(/\s+/g, '_')}_timestamps.txt`;
    downloadFile(content, filename, 'text/plain');
    onNotify?.('📺 Timestamps de YouTube exportados');
  };

  const handleCopyYouTube = async () => {
    const content = exportToYouTube(session);
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedType('youtube');
      setTimeout(() => setCopiedType(null), 2000);
      onNotify?.('📋 Timestamps copiados al portapapeles');
    }
  };

  const handleExportCSV = () => {
    const content = exportToCSV(session);
    const filename = `${session.name.replace(/\s+/g, '_')}_clips.csv`;
    downloadFile(content, filename, 'text/csv');
    onNotify?.('📊 CSV exportado exitosamente');
  };

  const hasClips = session.clips.length > 0;

  return (
    <div className={`${theme.glass} rounded-2xl p-4 md:p-6`}>
      <h3 className={`text-lg font-semibold ${theme.text.primary} mb-4 flex items-center gap-2`}>
        📥 Exportar
      </h3>

      {!hasClips ? (
        <p className={`text-center py-4 ${theme.text.muted}`}>
          Marca algunos momentos para poder exportar
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* JSON Export */}
          <button
            onClick={handleExportJSON}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${theme.card}
              hover:bg-white/10 transition-all group`}
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 
              group-hover:scale-110 transition-transform shadow-lg">
              <FileJson className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm font-medium ${theme.text.primary}`}>JSON</span>
            <span className={`text-xs ${theme.text.muted}`}>Datos completos</span>
          </button>

          {/* YouTube Timestamps */}
          <button
            onClick={handleExportYouTube}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${theme.card}
              hover:bg-white/10 transition-all group`}
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-red-500 to-rose-500 
              group-hover:scale-110 transition-transform shadow-lg">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm font-medium ${theme.text.primary}`}>YouTube</span>
            <span className={`text-xs ${theme.text.muted}`}>Timestamps</span>
          </button>

          {/* Copy YouTube */}
          <button
            onClick={handleCopyYouTube}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${theme.card}
              hover:bg-white/10 transition-all group`}
          >
            <div className={`p-3 rounded-full transition-transform shadow-lg
              ${copiedType === 'youtube' 
                ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                : 'bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:scale-110'}`}
            >
              {copiedType === 'youtube' ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <Copy className="w-5 h-5 text-white" />
              )}
            </div>
            <span className={`text-sm font-medium ${theme.text.primary}`}>
              {copiedType === 'youtube' ? '¡Copiado!' : 'Copiar'}
            </span>
            <span className={`text-xs ${theme.text.muted}`}>Al portapapeles</span>
          </button>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl ${theme.card}
              hover:bg-white/10 transition-all group`}
          >
            <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-teal-500 
              group-hover:scale-110 transition-transform shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className={`text-sm font-medium ${theme.text.primary}`}>CSV</span>
            <span className={`text-xs ${theme.text.muted}`}>Para Excel</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default ExportPanel;
