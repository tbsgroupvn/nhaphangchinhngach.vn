# Dependency Audit Report
**Date:** 2026-01-01
**Project:** nhaphangchinhngach.vn
**Node Version:** >=18.0.0

---

## Executive Summary

This audit analyzed all project dependencies for:
- **Security vulnerabilities** (35 found: 2 critical, 10 high, 17 moderate, 6 low)
- **Outdated packages** (15 major version updates available)
- **Unnecessary bloat** (3 unused packages identified)

**Immediate Actions Required:**
1. Remove 3 unused dependencies (~50MB+ reduction)
2. Update netlify-cli to fix 30+ security vulnerabilities
3. Consider upgrading Next.js and React to latest versions

---

## 1. Security Vulnerabilities

### Critical Issues (2)

**Source:** `netlify-cli` (devDependency)

1. **esbuild** - Arbitrary code execution vulnerability
   - Severity: Critical
   - CVE: Multiple advisories
   - Affected: esbuild versions in netlify-cli dependencies

2. **glob** - ReDoS vulnerability
   - Severity: High (affects eslint-config-next)
   - CVE: Multiple advisories
   - Can be fixed by updating eslint-config-next

### High Severity Issues (10)

All related to `netlify-cli` transitive dependencies:
- `tar-fs` - Path traversal vulnerabilities (6 advisories)
- `@next/eslint-plugin-next` - glob ReDoS vulnerability
- Multiple other high-severity issues in Netlify tooling

### Moderate & Low Severity Issues (23)

Primarily in `netlify-cli` dependencies:
- `@octokit/*` packages - ReDoS vulnerabilities
- `inquirer` - Vulnerable dependencies
- `tmp` - Symlink attack vulnerability

### Recommendations

**Priority 1 (Immediate):**
```bash
# Update netlify-cli to latest version
npm update netlify-cli

# Update eslint-config-next (fixes glob vulnerability)
npm install eslint-config-next@latest
```

**Priority 2 (This Sprint):**
- Consider if Netlify deployment is required
- If not deploying to Netlify, remove `netlify-cli` and `@netlify/plugin-nextjs`
- This would eliminate 30+ vulnerabilities

**Priority 3 (Monitor):**
- Run `npm audit fix` to auto-fix low-risk vulnerabilities
- Review remaining issues quarterly

---

## 2. Outdated Packages

### Major Framework Updates Available

| Package | Current | Latest | Breaking Changes |
|---------|---------|--------|------------------|
| **next** | 14.2.16 | 16.1.1 | Yes (2 major versions) |
| **react** | 18.3.1 | 19.2.3 | Yes (React 19) |
| **react-dom** | 18.3.1 | 19.2.3 | Yes (React 19) |
| **tailwindcss** | 3.4.19 | 4.1.18 | Yes (v4 rewrite) |
| **eslint** | 8.57.1 | 9.39.2 | Yes |
| **eslint-config-next** | 14.2.16 | 16.1.1 | Yes |

### Library Updates (Major Versions)

| Package | Current | Latest | Impact |
|---------|---------|--------|--------|
| **@hookform/resolvers** | 3.10.0 | 5.2.2 | Medium |
| **date-fns** | 3.6.0 | 4.1.0 | Low |
| **framer-motion** | 10.18.0 | 12.23.26 | Low (unused) |
| **googleapis** | 150.x | 169.x | Low (unused) |
| **recharts** | 2.15.4 | 3.6.0 | Medium |
| **zod** | 3.25.76 | 4.3.4 | Medium |

### Type Definition Updates

| Package | Current | Latest | Safe to Update |
|---------|---------|--------|----------------|
| **@types/node** | 20.x | 25.x | ⚠️ Check compatibility |
| **@types/react** | 18.x | 19.x | ⚠️ Only with React 19 |
| **@types/react-dom** | 18.x | 19.x | ⚠️ Only with React 19 |

### Recommendations

**Quick Wins (Low Risk):**
```bash
# Update utility libraries
npm install date-fns@latest
npm install @hookform/resolvers@latest
npm install zod@latest

# Update type definitions (matching current versions)
npm install @types/node@^20
```

**Medium Risk (Plan & Test):**
```bash
# Update recharts (breaking changes in v3)
npm install recharts@latest

# Review breaking changes documentation first
```

**High Risk (Separate Sprint):**
- **Next.js 14 → 16**: Requires thorough testing, App Router changes
- **React 18 → 19**: New features, deprecated APIs, requires codebase review
- **Tailwind CSS 3 → 4**: Complete rewrite, config migration needed
- **ESLint 8 → 9**: New flat config system

---

## 3. Unnecessary Bloat

### Unused Dependencies (Remove Immediately)

#### 1. **googleapis** (UNUSED)
- **Size:** ~15MB
- **Status:** Installed but not used
- **Finding:** Code uses client-side `gapi` library loaded from CDN
- **File:** src/lib/google-drive-service.ts only uses browser-based gapi
- **Action:**
  ```bash
  npm uninstall googleapis
  ```

#### 2. **@google/generative-ai** (UNUSED)
- **Size:** ~5MB
- **Status:** Installed but never imported
- **Finding:** No usage found in codebase
- **Action:**
  ```bash
  npm uninstall @google/generative-ai
  ```

#### 3. **framer-motion** (UNUSED)
- **Size:** ~10MB
- **Status:** Installed but never imported
- **Finding:** No animations using framer-motion found
- **Action:**
  ```bash
  npm uninstall framer-motion
  ```

**Total Savings:** ~30MB in node_modules, faster installs

### Potentially Unnecessary Dependencies

#### netlify-cli + @netlify/plugin-nextjs (Dev Dependency)
- **Size:** ~150MB (largest dependency)
- **Security:** 30+ vulnerabilities
- **Question:** Is the project deployed to Netlify?
- **Alternative:** If deploying elsewhere (Vercel, self-hosted), remove these
- **Action if not using Netlify:**
  ```bash
  npm uninstall netlify-cli @netlify/plugin-nextjs
  # Also delete netlify.toml
  ```

### Dependencies to Monitor

#### 1. **recharts** (2.15.4)
- **Usage:** Admin analytics dashboard
- **Size:** ~8MB
- **Alternative:** Chart.js (~3MB) or lightweight alternatives
- **Action:** Keep for now, but consider alternatives if performance issues

#### 2. **react-quill** (2.0.0)
- **Usage:** Blog post editor
- **Size:** ~5MB (includes Quill.js)
- **Alternative:** Tiptap, Lexical, or headless editors
- **Action:** Keep for now, essential for CMS functionality

#### 3. **bcryptjs** (3.0.3)
- **Usage:** Password hashing in init-admin
- **Note:** Pure JS implementation (slower than bcrypt native)
- **Alternative:** Consider native `bcrypt` if performance critical
- **Action:** Keep for now, works well for current scale

---

## 4. Dependency Size Analysis

### Largest Dependencies (Estimated)

1. **netlify-cli** - ~150MB (dev)
2. **next** - ~40MB
3. **@supabase/supabase-js** - ~20MB
4. **googleapis** - ~15MB ❌ UNUSED
5. **framer-motion** - ~10MB ❌ UNUSED
6. **recharts** - ~8MB
7. **@google-analytics/data** - ~8MB
8. **react-quill** - ~5MB
9. **@google/generative-ai** - ~5MB ❌ UNUSED

---

## 5. Action Plan

### Phase 1: Immediate (This Week)

**Remove unused packages:**
```bash
npm uninstall googleapis @google/generative-ai framer-motion
```

**Update security patches:**
```bash
npm update netlify-cli
npm audit fix
```

**Expected Impact:**
- Reduce node_modules by ~30MB
- Fix multiple vulnerabilities
- Faster CI/CD builds

### Phase 2: Low-Risk Updates (Next Sprint)

**Update utility libraries:**
```bash
npm install date-fns@latest @hookform/resolvers@latest
npm install zod@latest
npm install @types/node@^20
```

**Update documentation packages:**
```bash
npm update gray-matter jose classnames
```

### Phase 3: Medium-Risk Updates (Plan 2-3 weeks)

**Research & Plan:**
- Review Next.js 15 & 16 migration guides
- Review React 19 changes
- Review Tailwind CSS v4 migration
- Test in development environment

**If deploying to Netlify:**
```bash
npm update @netlify/plugin-nextjs
```

**If NOT deploying to Netlify:**
```bash
npm uninstall netlify-cli @netlify/plugin-nextjs
rm netlify.toml
```

### Phase 4: Major Updates (Separate Epic)

**Next.js & React Upgrade:**
- Create feature branch
- Update Next.js 14 → 15 → 16
- Update React 18 → 19
- Update all @types packages
- Comprehensive testing
- Performance benchmarking

**Estimated Effort:** 2-3 developer days

---

## 6. Maintenance Recommendations

### Regular Dependency Hygiene

**Weekly:**
```bash
npm outdated
```

**Monthly:**
```bash
npm audit
npm update --save  # Update patch/minor versions
```

**Quarterly:**
- Review unused dependencies with `depcheck`:
  ```bash
  npx depcheck
  ```
- Review bundle size with `next-bundle-analyzer`
- Plan major version updates

### Development Practices

1. **Before adding new dependencies:**
   - Check if functionality exists in existing deps
   - Evaluate package size and maintenance status
   - Consider tree-shaking support

2. **Use exact versions for critical deps:**
   ```json
   "next": "14.2.16"  // Not "^14.2.16"
   ```

3. **Document why dependencies exist:**
   - Add comments in package.json for unusual deps
   - Keep this audit report updated

### Tooling Recommendations

**Add to package.json scripts:**
```json
{
  "scripts": {
    "audit:deps": "npm outdated && npm audit",
    "analyze": "cross-env ANALYZE=true next build",
    "check:unused": "npx depcheck"
  }
}
```

---

## 7. Summary of Recommendations

### Immediate Actions (Do Now)

✅ **Remove unused packages** - Saves 30MB, zero risk
```bash
npm uninstall googleapis @google/generative-ai framer-motion
```

✅ **Update security patches**
```bash
npm update netlify-cli
npm audit fix
```

### Short-term (Next 2 Weeks)

⚠️ **Decide on Netlify** - If not using, remove (saves 150MB, fixes 30+ vulnerabilities)

⚠️ **Update utility libraries** - Low risk, good practice
```bash
npm install date-fns@latest @hookform/resolvers@latest zod@latest
```

### Medium-term (Next Quarter)

📋 **Plan major framework updates:**
- Next.js 14 → 16
- React 18 → 19
- Tailwind CSS 3 → 4
- ESLint 8 → 9

### Long-term (Continuous)

🔄 **Establish dependency maintenance schedule:**
- Monthly security audits
- Quarterly dependency reviews
- Annual major version upgrades

---

## Appendix: Command Reference

### Quick Audit Commands
```bash
# Check for outdated packages
npm outdated

# Check for security vulnerabilities
npm audit

# Check for unused dependencies
npx depcheck

# Analyze bundle size
npm run analyze

# Update all patch/minor versions
npm update

# Update specific package to latest
npm install <package>@latest
```

### Safe Removal Commands
```bash
# Remove unused packages identified in this audit
npm uninstall googleapis @google/generative-ai framer-motion

# If not using Netlify
npm uninstall netlify-cli @netlify/plugin-nextjs
```

### Emergency Rollback
```bash
# If updates cause issues
git checkout package.json package-lock.json
npm ci
```

---

**Report Generated:** 2026-01-01
**Next Review:** 2026-04-01 (Quarterly)
