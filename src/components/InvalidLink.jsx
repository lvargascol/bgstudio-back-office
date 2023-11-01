
import Link from 'next/link';

export default function InvalidLinkPage() {

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            The recovery link is invalid or has expired
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div className="text-sm">
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 flex justify-center">
                Back to login page
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
