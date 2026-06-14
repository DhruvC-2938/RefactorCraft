export default function FixHistory({ onUndo, onRedo }) {
  return (
    <div className="flex items-center bg-white/60 border border-indigo-200 rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={onUndo} 
        className="flex-1 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-2 transition-colors"
      >
        <span className="text-lg leading-none mb-0.5">↩</span> Undo
      </button>
      
      {/* Divider */}
      <div className="w-px h-6 bg-indigo-200"></div>
      
      <button 
        onClick={onRedo} 
        className="flex-1 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-100 flex items-center justify-center gap-2 transition-colors"
      >
        <span className="text-lg leading-none mb-0.5">↪</span> Redo
      </button>
    </div>
  );
}