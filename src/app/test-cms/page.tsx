export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          ✅ CMS Routes Working!
        </h1>

        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded p-4">
            <p className="text-green-800 font-medium">
              This page is served from: <code className="bg-green-100 px-2 py-1 rounded">/src/app/test-cms/page.tsx</code>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <h2 className="font-bold text-blue-900 mb-2">Test These URLs:</h2>
            <ul className="space-y-2 text-blue-800">
              <li>✅ <a href="/test-cms" className="underline hover:text-blue-600">/test-cms</a> - This page</li>
              <li>🔐 <a href="/cms-login" className="underline hover:text-blue-600">/cms-login</a> - Login page</li>
              <li>🏠 <a href="/admin/dashboard" className="underline hover:text-blue-600">/admin/dashboard</a> - Dashboard (requires login)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <h2 className="font-bold text-yellow-900 mb-2">If you see this page:</h2>
            <ul className="list-disc list-inside space-y-1 text-yellow-800">
              <li>Next.js App Router is working ✅</li>
              <li>Netlify deployment is working ✅</li>
              <li>CMS routes should also work ✅</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <h2 className="font-bold text-gray-900 mb-2">If /cms-login still shows 404:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Make sure you&apos;re accessing <code className="bg-gray-100 px-2 py-1 rounded">/cms-login</code> (no trailing slash)</li>
              <li>Clear your browser cache (Ctrl+Shift+R or Cmd+Shift+R)</li>
              <li>Try incognito/private mode</li>
              <li>Check Netlify deploy logs for errors</li>
              <li>Trigger a new deploy: Netlify Dashboard → Deploys → Trigger deploy</li>
            </ol>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Deploy Info:</strong><br />
              Built with Next.js 14 App Router<br />
              Deployed on Netlify<br />
              Timestamp: {new Date().toISOString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
