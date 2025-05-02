import { AlertTriangle } from 'lucide-react'

interface ConnectionErrorDisplayProps {
  message?: string
}

export default function ConnectionErrorDisplay({ message = "Database connection error" }: ConnectionErrorDisplayProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {message}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              This site requires environment variables to connect to the database.
              Please make sure the following environment variables are set in Netlify:
            </p>
            <ul className="mt-1 list-disc pl-5">
              <li>VITE_SUPABASE_URL</li>
              <li>VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
