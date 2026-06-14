import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeFileLocally } from '../utils/complexityAnalyzer';
import { CodeQueue } from '../utils/codeQueue';

export default function CodeCheckerQueue({ data, onFileSelect, auditState, setAuditState }) {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Only flatten if we don't have results yet
    if (auditState.files.length === 0) {
      const flatten = (nodes) => {
        let f = [];
        const arr = Array.isArray(nodes) ? nodes : [nodes];
        arr.forEach(n => {
          const isCodeFile = /\.(js|jsx|ts|tsx)$/i.test(n.name);
          if (n.type === 'file' && isCodeFile) {
            f.push({ ...n, status: 'Pending', score: 0, color: 'slate', advice: [] });
          } else if (n.children) f = f.concat(flatten(n.children));
        });
        return f;
      };
      setAuditState({ ...auditState, files: flatten(data) });
    }
  }, [data]);

  const startScan = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    let currentFiles = [...auditState.files].sort((a, b) => b.content.length - a.content.length);

    for (let i = 0; i < currentFiles.length; i++) {
      currentFiles[i].status = 'Scanning...';
      setAuditState({ ...auditState, files: [...currentFiles] });

      await new Promise(r => setTimeout(r, 1200));

      const report = analyzeFileLocally(currentFiles[i].content);
      currentFiles[i] = { ...currentFiles[i], ...report, status: 'Checked ✅' };

      currentFiles.sort((a, b) => {
        if (a.status === 'Checked ✅' && b.status !== 'Checked ✅') return -1;
        if (a.status !== 'Checked ✅' && b.status === 'Checked ✅') return 1;
        return b.score - a.score;
      });

      setAuditState({ files: [...currentFiles], scanComplete: true });
    }
    setIsProcessing(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Checker Queue</h2>
        <button onClick={startScan} disabled={isProcessing || auditState.scanComplete} className="bg-indigo-600 text-white px-3 py-1 text-[10px] font-bold rounded-lg uppercase">
          {isProcessing ? 'Analyzing...' : 'Start Scan'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <AnimatePresence>
          {auditState.files.map((file) => (
            <motion.div
  key={file.name}
  layout
  transition={{ type: "spring", stiffness: 100, damping: 20 }}
  onClick={() => onFileSelect(file)}
  className={`p-3 border-2 rounded-xl cursor-pointer flex flex-col transition-colors
    ${
      file.status === 'Checked ✅'
        ? file.color === 'rose'
          ? 'bg-rose-50 border-rose-400'
          : file.color === 'amber'
          ? 'bg-amber-50 border-amber-400'
          : 'bg-emerald-50 border-emerald-400'
        : 'bg-white border-slate-100'
    }`}
>
              <div className="flex justify-between items-center w-full">
                <div>
                  <p className="font-mono text-xs font-bold text-slate-700">{file.name}</p>
                  <span className="text-[9px] opacity-70">{file.status}</span>
                </div>
                {file.status === 'Checked ✅' && (
                  <motion.span
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  className={`text-lg font-black ${
    file.color === 'rose'
      ? 'text-rose-600'
      : file.color === 'amber'
      ? 'text-amber-600'
      : 'text-emerald-600'
  }`}
>
                    {file.score}
                  </motion.span>
                )}
              </div>

              {file.status === 'Checked ✅' && file.issues && file.issues.length > 0 ? (
                <div className="mt-2 pt-2 border-t border-black/10">
                  <p className="text-[9px] font-bold uppercase tracking-wider opacity-60 mb-1">
                    🛠 Actionable Refactor Items:
                  </p>
                  {file.issues.map((issue, i) => (
                    <div key={i} className="mb-1.5 p-2 bg-rose-50 rounded-lg border border-rose-100">
                      <p className="text-[9px] font-bold text-rose-800">
                        {issue.type || `Line ${issue.line}`}
                      </p>
                      <p className="text-[9px] text-rose-600">{issue.msg}</p>
                    </div>
                  ))}
                </div>
              ) : file.status === 'Checked ✅' && (
                <div className="mt-2 text-[9px] text-emerald-600 font-bold italic">
                  ✨ Logic optimized. No major refactoring needed.
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}