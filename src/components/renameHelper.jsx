import { useState } from 'react';

export default function RenameHelper({ onRename }) {
  const [isOpen, setIsOpen] = useState(false);
  const [oldWord, setOldWord] = useState('');
  const [newWord, setNewWord] = useState('');

  const handleApply = () => {
    if (!oldWord || !newWord) return;
    onRename(oldWord, newWord);
    setOldWord('');
    setNewWord('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-indigo-600 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
      >
        ✏️ Smart Rename
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-1">
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Target word..." 
          value={oldWord}
          onChange={(e) => setOldWord(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        <span className="text-slate-400 font-bold">→</span>
        <input 
          type="text" 
          placeholder="New name..." 
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
      </div>
      <div className="flex items-center justify-end gap-2 mt-1">
        <button 
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          onClick={handleApply}
          className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
}