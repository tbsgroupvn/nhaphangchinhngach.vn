import ts from 'typescript'
import { readFileSync, writeFileSync } from 'node:fs'

const seeds = JSON.parse(readFileSync('src/data/fixed-page-seeds.json', 'utf8'))
const outputs = []
for (const seed of seeds) {
  const path = `src/app${seed.path === '/' ? '' : seed.path}/page.tsx`
  let text = readFileSync(path, 'utf8')
  if (text.includes("from '@/lib/studio/fixed-pages'")) throw new Error(`Already connected: ${path}`)
  const ast = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const edits = []
  for (const node of ast.statements) {
    if (ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => ['metadata', 'policy'].includes(declaration.name.getText(ast)))) edits.push({ start: node.getStart(ast), end: node.end, text: '' })
    if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === 'next' && node.importClause?.isTypeOnly) edits.push({ start: node.getStart(ast), end: node.end, text: '' })
    if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === '@/components/marketing/InteriorPages') {
      const names = node.importClause.namedBindings.elements.filter(item => !['pageMetadata', 'policyContent'].includes(item.name.text)).map(item => item.getText(ast))
      edits.push({ start: node.getStart(ast), end: node.end, text: `import { ${names.join(', ')} } from '@/components/marketing/InteriorPages'` })
    }
    if (ts.isExportAssignment(node) && ts.isIdentifier(node.expression)) edits.push({ start: node.getStart(ast), end: node.end, text: `export default function Page() { return <${node.expression.text} /> }` })
  }
  for (const edit of edits.sort((a, b) => b.start - a.start)) text = text.slice(0, edit.start) + edit.text + text.slice(edit.end)
  text = `import { fixedPageMetadata } from '@/lib/studio/fixed-pages'\nexport const dynamic = 'force-dynamic'\nexport function generateMetadata() { return fixedPageMetadata('${seed.slug}') }\n` + text
  outputs.push([path, text])
}
for (const [path, text] of outputs) writeFileSync(path, text)
console.log(`Connected metadata for ${outputs.length} fixed routes`)
