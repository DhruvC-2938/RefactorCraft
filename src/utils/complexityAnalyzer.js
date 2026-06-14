// src/utils/complexityAnalyzer.js

export function analyzeFileLocally(content) {
    const lines = content.split('\n');

    const issues = [];
    const nestedBlocks = [];

    let ifCount = 0;

    let depth = 0;
    let startLine = null;
    let blockIfCount = 0;

    lines.forEach((line, index) => {
        const lineNo = index + 1;

        if (/\bif\b/.test(line)) {
            ifCount++;
            blockIfCount++;

            if (startLine === null) {
                startLine = lineNo;
            }
        }

        depth += (line.match(/\{/g) || []).length;
        depth -= (line.match(/\}/g) || []).length;

        if (startLine !== null && depth === 0) {
            if (blockIfCount >= 3) {
                nestedBlocks.push({
                    startLine,
                    endLine: lineNo,
                    ifCount: blockIfCount
                });
            }

            startLine = null;
            blockIfCount = 0;
        }
    });

    nestedBlocks.forEach(block => {
        issues.push({
            line: block.startLine,
            msg: `Lines ${block.startLine}-${block.endLine}: ${block.ifCount} conditional branches detected.`
        });
    });

    const score = Math.min(10, ifCount);

    return {
        score,

        verdict:
            score >= 7
                ? 'Needs Refactoring'
                : score >= 4
                    ? 'Moderate'
                    : 'Clean',

        color:
            score >= 7
                ? 'rose'
                : score >= 4
                    ? 'amber'
                    : 'emerald',

        issues,
        advice: []
    };
}

export function analyzeFunctions(content, fileName) {
    const functions = [];

    const functionRegex =
        /(export\s+default\s+function\s+([a-zA-Z_$][\w$]*))|(function\s+([a-zA-Z_$][\w$]*))|(const\s+([a-zA-Z_$][\w$]*)\s*=\s*(async\s*)?\([^)]*\)\s*=>)|(let\s+([a-zA-Z_$][\w$]*)\s*=\s*(async\s*)?\([^)]*\)\s*=>)/g;

    let match;

    while ((match = functionRegex.exec(content)) !== null) {
        const functionName =
            match[2] ||
            match[4] ||
            match[6] ||
            match[9];

        if (!functionName) continue;

        // Ignore React hooks
        if (
            [
                'useEffect',
                'useState',
                'useMemo',
                'useCallback'
            ].includes(functionName)
        ) {
            continue;
        }

        const startIndex = match.index;

        const startLine =
            content.substring(0, startIndex).split('\n').length;

        let braceCount = 0;
        let endIndex = startIndex;
        let foundFirstBrace = false;

        for (let i = startIndex; i < content.length; i++) {
            if (content[i] === '{') {
                braceCount++;
                foundFirstBrace = true;
            }

            if (content[i] === '}') {
                braceCount--;

                if (foundFirstBrace && braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }

        const functionBody = content.substring(
            startIndex,
            Math.min(endIndex, startIndex + 5000)
        );

        const ifCount =
            (functionBody.match(/\bif\b/g) || []).length;

        const loopCount =
            (functionBody.match(/\b(for|while)\b/g) || []).length;

        const switchCount =
            (functionBody.match(/\bswitch\b/g) || []).length;

        let nestingDepth = 0;
        let currentDepth = 0;

        let firstIfLine = null;
        let firstLoopLine = null;
        let firstSwitchLine = null;

        let deepestLine = startLine;
        let maxDepth = 0;

        const functionLines =
            functionBody.split('\n');

        functionLines.forEach((currentLine, index) => {
            const actualLine =
                startLine + index;

            if (
                firstIfLine === null &&
                /\bif\b/.test(currentLine)
            ) {
                firstIfLine = actualLine;
            }

            if (
                firstLoopLine === null &&
                /\b(for|while)\b/.test(currentLine)
            ) {
                firstLoopLine = actualLine;
            }

            if (
                firstSwitchLine === null &&
                /\bswitch\b/.test(currentLine)
            ) {
                firstSwitchLine = actualLine;
            }

            const opens =
                (currentLine.match(/\{/g) || []).length;

            const closes =
                (currentLine.match(/\}/g) || []).length;

            currentDepth += opens;

            if (currentDepth > maxDepth) {
                maxDepth = currentDepth;
                deepestLine = actualLine;
            }

            nestingDepth = Math.max(
                nestingDepth,
                currentDepth
            );

            currentDepth -= closes;
        });

        let rawScore =
(ifCount * 2) +
(loopCount * 3) +
(switchCount * 3) +
(nestingDepth * 2);

if (functionBody.includes("while(true)")) {
rawScore += 10;
}

if (functionBody.includes("for(;;)")) {
rawScore += 10;
}

if (
    functionName[0] === functionName[0]?.toUpperCase()
) {
    rawScore += 2;
}

const score = Math.max(
1,
Math.min(
10,
Math.ceil(rawScore / 2)
)
);

    let verdict;
let color;

if (score >= 8) {
verdict = "Critical";
color = "rose";
}
else if (score >= 4) {
verdict = "Moderate";
color = "amber";
}
else {
verdict = "Clean";
color = "emerald";
}
        functions.push({
            name: functionName,
            file: fileName,

            line: startLine,

            ifCount,
            loopCount,
            switchCount,
            nestingDepth,

            firstIfLine,
            firstLoopLine,
            firstSwitchLine,
            deepestLine,

            score,

            verdict,
            color
        });
    }

    const componentName = fileName.replace(/\.(jsx|js|tsx|ts)$/i, '');

    const componentExists = functions.some(
        fn => fn.name === componentName
    );

    if (!componentExists) {
        const componentIfs =
            (content.match(/\bif\b/g) || []).length;

        const componentLoops =
            (content.match(/\b(for|while)\b/g) || []).length;

        functions.unshift({
            name: componentName,
            file: fileName,

            line: 1,

            ifCount: componentIfs,
            loopCount: componentLoops,
            switchCount: 0,
            nestingDepth: 1,

            firstIfLine: 1,
            firstLoopLine: 1,
            firstSwitchLine: 1,
            deepestLine: 1,

            score: Math.min(
                10,
                componentIfs +
                componentLoops * 2 +
                2
            ),

            verdict: 'Moderate',
            color: 'amber'
        });
    }
    console.log("FUNCTIONS FOUND:", functions);
    return functions;
}