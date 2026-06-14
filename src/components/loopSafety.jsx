import { useState } from 'react';

// NEW: Accepting findings and onFindingsUpdate as props
export default function LoopSafetyNet({ selectedFile, findings = [], onFindingsUpdate }) {
  const [status, setStatus] = useState('idle');

  const runSafetyCheck = () => {
    if (!selectedFile || !selectedFile.content) return;

    setStatus('testing');
    onFindingsUpdate([]); // Reset global findings

    setTimeout(() => {
      const lines = selectedFile.content.split('\n');
      const detected = [];

      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // ---------------------------------------------------------
        // THE FIX: Strip comments from the line before evaluating it
        // This preserves the original line numbers for the UI!
        // ---------------------------------------------------------
        const cleanLine = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
        const trimmed = cleanLine.trim();

        // If the line is empty (or was just a comment), skip it completely
        if (!trimmed) return;

        if (/while\s*\(\s*true\s*\)/.test(trimmed)) {
          detected.push({ line: lineNum, type: 'Infinite Loop', code: trimmed, fix: 'Add a break condition.' });
        }
        if (/for\s*\(\s*;\s*;\s*\)/.test(trimmed)) {
          detected.push({ line: lineNum, type: 'Infinite Loop', code: trimmed, fix: 'Add proper init, condition and increment.' });
        }
        if (/while\s*\(\s*1\s*\)/.test(trimmed)) {
          detected.push({ line: lineNum, type: 'Infinite Loop', code: trimmed, fix: 'Replace with a real exit condition.' });
        }

        const whileMatch = trimmed.match(/while\s*\(\s*([a-zA-Z_$]\w*)/);
        if (whileMatch && !['true', 'false'].includes(whileMatch[1])) {
          const conditionVar = whileMatch[1]; 
          
          let loopBody = '';
          let openBraces = 0;
          let blockStarted = false;

          for (let j = index; j < lines.length; j++) {
            // Also strip comments from the body scanner so it doesn't get confused
            const currentLine = lines[j].replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
            
            if (j === index) {
              const conditionEnd = currentLine.indexOf(')');
              if (conditionEnd !== -1) {
                loopBody += currentLine.substring(conditionEnd) + '\n';
              }
            } else {
              loopBody += currentLine + '\n';
            }

            if (currentLine.includes('{')) {
              blockStarted = true;
              openBraces += (currentLine.match(/\{/g) || []).length;
            }
            if (currentLine.includes('}')) {
              openBraces -= (currentLine.match(/\}/g) || []).length;
            }

            if (blockStarted && openBraces === 0) break;
            if (!blockStarted && j > index && currentLine.trim() !== '') break;
          }

          const modificationRegex = new RegExp(`${conditionVar}\\s*(\\+\\+|--|[+\\-*/]?=)`);
          const isModified = modificationRegex.test(loopBody);
          
          if (!isModified) {
            detected.push({
              line: lineNum,
              type: 'Potential Infinite Loop',
              code: trimmed,
              fix: `"${conditionVar}" is not updated within the loop body.`
            });
          }
        }
      });

      // Update the global state in App.jsx
      onFindingsUpdate(detected);
      setStatus(detected.length > 0 ? 'timeout' : 'safe');
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000); 

    }, 800); 
  };

  return (
    <div className="flex flex-col gap-3 min-h-0">
      <button
        onClick={runSafetyCheck}
        disabled={status === 'testing' || !selectedFile}
        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
          !selectedFile ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' :
          status === 'idle' ? 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50' :
          status === 'testing' ? 'bg-amber-100 text-amber-700 border border-amber-300 animate-pulse cursor-wait' :
          status === 'safe' ? 'bg-emerald-500 text-white shadow-emerald-200' :
          'bg-red-500 text-white shadow-red-200'
        }`}
      >
        {status === 'idle' && <><span>🧪</span> Run Safety Scan</>}
        {status === 'testing' && <><span>⏳</span> Analyzing Context...</>}
        {status === 'safe' && <><span>✅</span> Execution Safe</>}
        {status === 'timeout' && <><span>🛑</span> Loop Risk Detected</>}
      </button>

      {/* NEW UI: Inline, scrollable area instead of absolute positioning */}
      {findings && findings.length > 0 && (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-64 pr-1 scrollbar-thin scrollbar-thumb-rose-200">
          {findings.map((f, i) => (
            <div key={i} className="bg-white border border-rose-100 rounded-xl p-3 text-xs shadow-sm shrink-0">
              <div className="font-bold text-rose-600 text-sm mb-1.5">Line {f.line}: {f.type}</div>
              <div className="font-mono text-slate-600 bg-slate-50 border border-slate-100 rounded p-1.5 mb-2 truncate">
                {f.code}
              </div>
              <div className="text-slate-500 leading-relaxed font-medium">{f.fix}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}