import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function PasswordChangedPage() {

  const [counter, setCounter] = useState(9);

  const router = useRouter();

  setInterval(() => {
    setCounter(counter - 1);
  }, 1000);

  counter <= 0 ? router.push('/login') : [];

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
            Your password has been changed successfully!
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

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <p className="mt-6 text-sm leading-0 text-gray-600 flex justify-center">
              You'll be redirected to the login page in {counter} seconds.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}
