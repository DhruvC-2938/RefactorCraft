import { useState, useEffect } from 'react';

// Standard JavaScript Reserved Keywords
const reservedWords = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 
  'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 
  'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 
  'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'enum', 
  'await', 'implements', 'package', 'protected', 'interface', 'private', 'public'
]);

export default function InstantWordChecker({ selectedFile }) {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (!selectedFile || !selectedFile.content) {
      setIssues([]);
      return;
    }

    // 1. Sanitize the code: Remove comments and strings so they don't trigger false positives
    const cleanContent = selectedFile.content
      .replace(/\/\/.*$/gm, '') // Strip single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '') // Strip multi-line comments
      .replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, ''); // Strip strings

    const lines = cleanContent.split('\n');
    const foundIssues = [];

    lines.forEach((line, index) => {
      // 2. Strict Regex: Only capture the exact contiguous string of characters immediately following a declaration
      const declarationRegex = /\b(let|const|var|function)\s+([^\s=;()[\]{}:,]+)/g;
      let match;
      
      while ((match = declarationRegex.exec(line)) !== null) {
        const keyword = match[1];
        const word = match[2];

        // 3. Strict Syntax Check (Cannot start with a number or use special characters)
        if (/^[0-9]/.test(word) || /[^a-zA-Z0-9_$]/.test(word)) {
          foundIssues.push({ 
            line: index + 1, word, type: 'error', 
            reason: 'Invalid JS syntax. Cannot start with a number or use special characters.' 
          });
          continue;
        }

        // 4. Reserved Keyword Check (Checks if they actually named a variable 'for', e.g., 'let for = 5')
        if (reservedWords.has(word)) {
          foundIssues.push({ 
            line: index + 1, word, type: 'error', 
            reason: `Cannot use reserved keyword '${word}' as a variable name.` 
          });
          continue;
        }

        // 5. Convention Definitions
        const isSingleLetter = /^[a-z]$/.test(word); 
        const isCamelCase = /^[a-z][a-zA-Z0-9]*$/.test(word); 
        const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(word); 
        const isConstant = /^[A-Z][A-Z0-9_]*$/.test(word); 
        const isStrictSnakeCase = /^[a-z]+(_[a-z0-9]+)+$/.test(word); 

        // 6. Allowed Exceptions
        if (isSingleLetter) continue; 
        if (keyword === 'function' && isPascalCase) continue; 
        if (keyword === 'const' && isConstant) continue; 

        // 7. Flag remaining bad conventions
        if (isStrictSnakeCase) {
          foundIssues.push({ 
            line: index + 1, word, type: 'warning', 
            reason: 'Python-style snake_case detected. Use camelCase for JS.' 
          });
        } else if (!isCamelCase && !isPascalCase) {
          foundIssues.push({ 
            line: index + 1, word, type: 'error', 
            reason: 'Non-standard naming. Stick to standard camelCase.' 
          });
        }
      }
    });

    setIssues(foundIssues);
  }, [selectedFile]);

  return (
    <div className="bg-white border-b border-slate-200 flex flex-col max-h-64 shrink-0">
      <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">🔍</span>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Linter</h2>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          issues.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {issues.length} Issues
        </span>
      </div>
      
      <div className="p-3 overflow-y-auto flex-1 space-y-2 bg-slate-50/50">
        {!selectedFile ? (
          <p className="text-xs text-slate-400 text-center py-4">Open a file to scan variables.</p>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-emerald-600">
            <span className="text-2xl mb-1">✨</span>
            <p className="text-xs font-bold">Perfect naming syntax!</p>
          </div>
        ) : (
          issues.map((issue, idx) => {
            const isError = issue.type === 'error';
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded p-2 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-xs font-bold px-1 rounded ${
                    isError ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'
                  }`}>
                    {issue.word}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">Line {issue.line}</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">{issue.reason}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}