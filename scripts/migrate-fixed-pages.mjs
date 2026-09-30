// One-time, parser-based migration of approved fixed-page copy. Do not rerun on migrated sources.
import ts from 'typescript'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
const { commonFAQs, preparationBrief } = createRequire(import.meta.url)('../src/data/marketing.ts')

const output = 'src/data/fixed-page-seeds.json'
if (existsSync(output)) throw new Error('Fixed-page seed manifest already exists; use a versioned migration for subsequent changes.')
const files = new Map()
function source(path) {
  if (!files.has(path)) {
    const text = readFileSync(path, 'utf8')
    files.set(path, { text, ast: ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX), edits: [] })
  }
  return files.get(path)
}
const interiorPath = 'src/components/marketing/InteriorPages.tsx'
const homePath = 'src/components/marketing/HomePage.tsx'
const interior = source(interiorPath)
const seeds = []
const pages = [
  ['home', '/', 'HomePage', homePath],
  ['about', '/gioi-thieu', 'AboutPage', interiorPath],
  ['operations', '/nang-luc-van-hanh', 'OperationsPage', interiorPath],
  ['services', '/dich-vu', 'ServiceHubPage', interiorPath],
  ['industries', '/nganh-hang', 'IndustryHubPage', interiorPath],
  ['process', '/quy-trinh', 'ProcessPage', interiorPath],
  ['costs', '/chi-phi-chung-tu', 'CostsPage', interiorPath],
  ['knowledge', '/kien-thuc', 'KnowledgePage', interiorPath],
  ['faq', '/hoi-dap', 'FAQPage', interiorPath],
  ['contact', '/lien-he', 'ContactPage', interiorPath],
]
function findVariable(name) {
  let found
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(interior.ast) === name) found = node
    ts.forEachChild(node, visit)
  }
  visit(interior.ast)
  if (!found) throw new Error(`Missing variable ${name}`)
  return found
}
function literal(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal)
  if (ts.isObjectLiteralExpression(node)) return Object.fromEntries(node.properties.map(property => {
    if (!ts.isPropertyAssignment(property)) throw new Error('Only literal properties are supported')
    return [property.name.text, literal(property.initializer)]
  }))
  throw new Error(`Unsupported literal ${ts.SyntaxKind[node.kind]}`)
}
function jsxText(text) {
  const lines = text.split(/\r\n|\n|\r/)
  let last = 0
  for (let i = 0; i < lines.length; i++) if (/[^ \t]/.test(lines[i])) last = i
  return lines.map((line, i) => {
    line = line.replace(/\t/g, ' ')
    if (i > 0) line = line.replace(/^ +/, '')
    if (i < lines.length - 1) line = line.replace(/ +$/, '')
    return line ? line + (i !== last ? ' ' : '') : ''
  }).join('')
}
function addField(seed, value, label, group = 'Nội dung trang', kind = 'text', key = `copy-${seed.fields.length + 1}`) {
  if (/&(?:[a-z]+|#\d+);/i.test(value)) throw new Error('Review HTML entity decoding before migration')
  seed.fields.push({ key, label, group, kind: kind === 'text' && value.length > 100 ? 'longtext' : kind, value })
  return `copy.text(${JSON.stringify(key)})`
}
function collect(seed, value, prefix, group) {
  if (typeof value === 'string') {
    const part = prefix.split('.').at(-1)
    const label = { title: 'Tiêu đề', heading: 'Tiêu đề mục', body: 'Nội dung', q: 'Câu hỏi', a: 'Trả lời', href: 'Liên kết', input: 'Đầu vào', work: 'Công việc', output: 'Kết quả' }[part] || 'Nội dung'
    addField(seed, value, `${label} · ${prefix}`, group, part === 'href' ? 'link' : 'text', prefix)
  } else if (Array.isArray(value)) value.forEach((item, index) => collect(seed, item, `${prefix}.${index}`, group))
  else for (const [key, item] of Object.entries(value)) collect(seed, item, `${prefix}.${key}`, group)
}
function metadata(path) {
  const route = source(`src/app${path === '/' ? '' : path}/page.tsx`)
  let values
  function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(route.ast) === 'pageMetadata') values = node.arguments.slice(0, 2).map(literal)
    ts.forEachChild(node, visit)
  }
  visit(route.ast)
  return values
}
for (const [slug, path, name, filename] of pages) {
  const file = source(filename)
  const fn = file.ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name)
  if (!fn?.body) throw new Error(`Missing function ${name}`)
  const seed = { slug, path, title: '', summary: '', image: '', seoTitle: '', seoDescription: '', fields: [] }
  const edit = (node, text) => file.edits.push({ start: node.getStart(file.ast), end: node.end, text })
  let count = 0
  function visit(node, group = 'Nội dung trang', context = '') {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const opening = ts.isJsxElement(node) ? node.openingElement : node
      const tag = opening.tagName.getText(file.ast)
      const title = opening.attributes.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.text === 'title' && attr.initializer && ts.isStringLiteral(attr.initializer))
      if (tag === 'TextSection' && title) group = title.initializer.text
      if (tag === 'section' && !title) group = `Phần nội dung ${++count}`
      ts.forEachChild(node, child => visit(child, group, tag))
      return
    }
    if (ts.isJsxText(node)) {
      const value = jsxText(node.text)
      if (!value.trim() || /^[\d\s:./]+$/.test(value)) return
      const label = /^h[1-6]$/.test(context) ? 'Tiêu đề' : context === 'p' ? 'Đoạn văn' : context === 'li' ? 'Ý chính' : 'Nhãn'
      const expression = addField(seed, value, `${label} ${seed.fields.length + 1}`, group)
      file.edits.push({ start: node.pos, end: node.end, text: `{${expression}}` })
      return
    }
    if (ts.isJsxAttribute(node)) {
      const attr = node.name.text
      if (['className', 'id', 'key', 'role', 'aria-labelledby', 'width', 'height', 'sizes', 'placement', 'variant'].includes(attr) || attr.startsWith('data-')) return
      if (node.initializer && ts.isStringLiteral(node.initializer)) {
        if (!['title', 'description', 'eyebrow', 'image', 'alt', 'src', 'href'].includes(attr)) return
        if (context === 'PageFrame' && ['title', 'description', 'image'].includes(attr)) {
          const key = attr === 'description' ? 'summary' : attr
          seed[key] = node.initializer.text
          edit(node.initializer, `{copy.${key}}`)
        } else {
          const kind = ['image', 'src'].includes(attr) ? 'image' : attr === 'href' ? 'link' : 'text'
          const label = { title: 'Tiêu đề mục', eyebrow: 'Nhãn đầu mục', alt: 'Mô tả ảnh', src: 'Ảnh', image: 'Ảnh', href: 'Liên kết' }[attr] || attr
          edit(node.initializer, `{${addField(seed, node.initializer.text, `${label} ${seed.fields.length + 1}`, group, kind)}}`)
        }
        return
      }
    }
    if (ts.isStringLiteral(node) && (ts.isPropertyAssignment(node.parent) || ts.isArrayLiteralExpression(node.parent))) {
      const property = ts.isPropertyAssignment(node.parent) ? node.parent.name.getText(file.ast) : ''
      const kind = property === 'href' ? 'link' : 'text'
      edit(node, addField(seed, node.text, `${property === 'href' ? 'Liên kết' : 'Nội dung'} ${seed.fields.length + 1}`, group, kind))
      return
    }
    ts.forEachChild(node, child => visit(child, group, context))
  }
  visit(fn.body)
  if (slug === 'home') {
    seed.title = 'TBS GROUP'
    seed.summary = 'Từ nguồn hàng đến bàn giao. Một đầu mối phối hợp, phương án rõ ràng cho từng lô hàng.'
    seed.image = '/images/marketing/containers.webp'
    seed.seoTitle = 'TBS GROUP | Nhập khẩu chính ngạch Trung Quốc - Việt Nam'
    seed.seoDescription = seed.summary
  } else [seed.seoTitle, seed.seoDescription] = metadata(path)
  let initialization = `\n  const copy = fixedPageCopy('${slug}', preview)\n`
  if (slug === 'process' || slug === 'costs') {
    const variable = slug === 'process' ? 'processSteps' : 'costRows'
    const declaration = findVariable(variable)
    collect(seed, literal(declaration.initializer), variable, slug === 'process' ? 'Năm bước phối hợp' : 'Bảng chi phí')
    interior.edits.push({ start: declaration.name.getStart(interior.ast), end: declaration.name.end, text: `${variable}Default` })
    initialization += `  const ${variable} = copy.collection(${variable}Default, '${variable}')\n`
  }
  if (slug === 'faq') {
    collect(seed, commonFAQs, 'faqs', 'Câu hỏi thường gặp')
    initialization += "  const commonFAQs = copy.collection(defaultFAQs, 'faqs')\n"
  }
  if (slug === 'contact') addField(seed, preparationBrief, 'Mẫu thông tin lô hàng', 'Chuẩn bị trao đổi', 'longtext', 'preparation-brief')
  file.edits.push({ start: fn.body.getStart(file.ast) + 1, end: fn.body.getStart(file.ast) + 1, text: initialization })
  const parameter = slug === 'knowledge' ? '{ q, category, preview }: { q?: string; category?: string; preview?: FixedPagePayload }' : '{ preview }: { preview?: FixedPagePayload } = {}'
  file.edits.push({ start: fn.parameters.pos, end: fn.parameters.end, text: parameter })
  seeds.push(seed)
}
const policies = literal(findVariable('policyContent').initializer)
for (const [slug, policy] of Object.entries(policies)) {
  const seed = { slug: `policy-${slug}`, path: `/chinh-sach/${slug}`, title: policy.title, summary: policy.description, image: '', seoTitle: policy.title, seoDescription: policy.description, fields: [] }
  collect(seed, policy.sections, 'sections', 'Nội dung chính sách')
  seeds.push(seed)
}
for (const filename of [homePath, interiorPath]) {
  const file = source(filename)
  file.edits.push({ start: 0, end: 0, text: "import { fixedPageCopy } from '@/lib/studio/fixed-pages'\nimport type { FixedPagePayload } from '@/lib/studio/content-model'\n" })
}
// An identifier import is changed by its parsed source location, not a whole-file replacement.
const importDeclaration = interior.ast.statements.find(node => ts.isImportDeclaration(node) && node.moduleSpecifier.text === '@/data/marketing')
const faqImport = importDeclaration.importClause.namedBindings.elements.find(node => node.name.text === 'commonFAQs')
interior.edits.push({ start: faqImport.getStart(interior.ast), end: faqImport.end, text: 'commonFAQs as defaultFAQs' })
const outputs = []
for (const [filename, file] of files) {
  const edits = file.edits.sort((a, b) => b.start - a.start)
  let previousStart = Infinity, text = file.text
  for (const edit of edits) {
    if (edit.end > previousStart) throw new Error(`Overlapping AST edits in ${filename}`)
    text = text.slice(0, edit.start) + edit.text + text.slice(edit.end)
    previousStart = edit.start
  }
  if (edits.length) outputs.push([filename, text])
}
if (process.argv.includes('--write')) {
  for (const [filename, text] of outputs) writeFileSync(filename, text)
  writeFileSync(output, JSON.stringify(seeds, null, 2) + '\n')
}
console.log(JSON.stringify(seeds.map(seed => ({ slug: seed.slug, fields: seed.fields.length, path: seed.path })), null, 2))
