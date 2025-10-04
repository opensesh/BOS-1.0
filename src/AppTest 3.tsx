// Temporary test component to verify Tailwind is working
export default function AppTest() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-black mb-4">Test Page</h1>
        <p className="text-gray-700">If you see this with styling, Tailwind is working!</p>
        <div className="mt-4 p-4 bg-brand-charcoal text-brand-vanilla rounded">
          Brand colors test
        </div>
      </div>
    </div>
  )
}
