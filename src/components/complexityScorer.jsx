import { analyzeFunctions } from '../utils/complexityAnalyzer';

export default function ComplexityScorer({
  auditState,
  onFileSelect,
  editorRef
}) {

  const rankedFunctions = [];

  auditState.files.forEach(file => {
    if (file.status !== 'Checked ✅') return;

    const functions = analyzeFunctions(
      file.content,
      file.name
    );

    rankedFunctions.push(...functions);
  });

  rankedFunctions.sort((a, b) => {
    if (b.score !== a.score)
      return b.score - a.score;

    return (
      b.ifCount +
      b.loopCount +
      b.nestingDepth
    ) - (
      a.ifCount +
      a.loopCount +
      a.nestingDepth
    );
  });

  const openFunction = (fn) => {

    const targetFile = auditState.files.find(
      file => file.name === fn.file
    );

    if (!targetFile) return;

    onFileSelect(targetFile);

    setTimeout(() => {

      const editor = editorRef?.current;

      if (!editor) return;

      editor.revealLineInCenter(fn.line);

      editor.setPosition({
        lineNumber: fn.line,
        column: 1
      });

      editor.focus();

    }, 250);
  };

  return (
    <div className="h-full bg-[#FDFDFD] p-6 overflow-y-auto">

      <div className="mb-6">
        <h3 className="text-sm font-black text-slate-800">
          Function Complexity Ranking
        </h3>

        <p className="text-[11px] text-slate-400 font-medium">
          Click a function to jump directly to its source code
        </p>
      </div>

      {rankedFunctions.length === 0 ? (
        <div className="text-center text-slate-400 mt-12">
          Run the checker queue first.
        </div>
      ) : (
        <div className="space-y-4">

          {rankedFunctions.map((fn, index) => {

            const verdict =
              fn.score >= 8
                ? 'CRITICAL'
                : fn.score >= 4
                ? 'MODERATE'
                : 'CLEAN';

            const color =
              fn.score >= 8
                ? 'rose'
                : fn.score >= 4
                ? 'amber'
                : 'emerald';

            return (

              <div
                key={`${fn.file}-${fn.name}-${index}`}
                onClick={() => openFunction(fn)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <div className="flex items-center gap-2">

                      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-xs font-black">
                        #{index + 1}
                      </span>

                      <div>
                        <p className="font-mono text-xs font-bold text-slate-700">
                          {fn.name}()
                        </p>

                        <p className="text-[10px] text-slate-400">
                          {fn.file}
                        </p>

                        <p className="text-[10px] text-indigo-500 mt-1">
                          Line {fn.line}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg
                    ${
                      color === 'rose'
                        ? 'bg-rose-100 text-rose-700'
                        : color === 'amber'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {fn.score}
                  </div>

                </div>

                <div className="mt-4">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full
                      ${
                        color === 'rose'
                          ? 'bg-rose-500'
                          : color === 'amber'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${(fn.score / 10) * 100}%`
                      }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center">

                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                    ${
                      color === 'rose'
                        ? 'bg-rose-50 text-rose-600'
                        : color === 'amber'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {verdict}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    Click To Open
                  </span>

                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Complexity Breakdown
                  </p>

                  <div className="grid grid-cols-2 gap-2">

                    <div
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!fn.firstIfLine) return;

                        editorRef?.current?.revealLineInCenter(fn.firstIfLine);

                        editorRef?.current?.setPosition({
                          lineNumber: fn.firstIfLine,
                          column: 1
                        });

                        editorRef?.current?.focus();
                      }}
                      className="bg-slate-50 rounded-lg p-2 cursor-pointer hover:bg-indigo-50"
                    >
                      <p className="text-[9px] text-slate-400 uppercase">
                        IF Statements
                      </p>

                      <p className="font-bold text-slate-700">
                        {fn.ifCount}
                      </p>
                    </div>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!fn.firstLoopLine) return;

                        editorRef?.current?.revealLineInCenter(fn.firstLoopLine);

                        editorRef?.current?.setPosition({
                          lineNumber: fn.firstLoopLine,
                          column: 1
                        });

                        editorRef?.current?.focus();
                      }}
                      className="bg-slate-50 rounded-lg p-2 cursor-pointer hover:bg-indigo-50"
                    >
                      <p className="text-[9px] text-slate-400 uppercase">
                        Loops
                      </p>

                      <p className="font-bold text-slate-700">
                        {fn.loopCount}
                      </p>
                    </div>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!fn.firstSwitchLine) return;

                        editorRef?.current?.revealLineInCenter(fn.firstSwitchLine);

                        editorRef?.current?.setPosition({
                          lineNumber: fn.firstSwitchLine,
                          column: 1
                        });

                        editorRef?.current?.focus();
                      }}
                      className="bg-slate-50 rounded-lg p-2 cursor-pointer hover:bg-indigo-50"
                    >
                      <p className="text-[9px] text-slate-400 uppercase">
                        Switches
                      </p>

                      <p className="font-bold text-slate-700">
                        {fn.switchCount}
                      </p>
                    </div>

                    <div
                      onClick={(e) => {
                        e.stopPropagation();

                        if (!fn.deepestLine) return;

                        editorRef?.current?.revealLineInCenter(fn.deepestLine);

                        editorRef?.current?.setPosition({
                          lineNumber: fn.deepestLine,
                          column: 1
                        });

                        editorRef?.current?.focus();
                      }}
                      className="bg-slate-50 rounded-lg p-2 cursor-pointer hover:bg-indigo-50"
                    >
                      <p className="text-[9px] text-slate-400 uppercase">
                        Nesting Depth
                      </p>

                      <p className="font-bold text-slate-700">
                        {fn.nestingDepth}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            );
          })}

        </div>
      )}
    </div>
  );
}