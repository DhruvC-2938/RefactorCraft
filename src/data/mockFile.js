export const dummyFileSystem = [
  {
    name: "src",
    type: "folder",
    children: [
      { 
        name: "App.jsx", 
        type: "file",
        content: "import React from 'react';\n\nfunction App() {\n  return <div>Hello</div>;\n}\n\nexport default App;"
      },
      { 
        name: "mathLogic.js", 
        type: "file",
        content: "function 2calculate(a, b) {\n  if (a > 0) {\n    for(let i=0; i<10; i++) {\n      if(b === i) console.log('match');\n    }\n  }\n  while(a < 10) { a++; }\n  return a + b;\n}"
      },
      {
        name: "components",
        type: "folder",
        children: [
          { 
            name: "FileExplorer.jsx", 
            type: "file",
            content: "function FileExplorer() {\n  if (!data) return null;\n  return <div>Explorer</div>;\n}" 
          }
        ]
      }
    ]
  },
  { 
    name: "package.json", 
    type: "file",
    content: "{\n  \"name\": \"refactor-craft\"\n}"
  }
];