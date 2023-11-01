import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@hooks/useAuth';
export default function RecoveryPage() {
  const emailRef = useRef(null);
  const auth = useAuth();
  const router = useRouter();
  const [emailSendError, setEmailSendError] = useState(false);
  const submitHandler = async (submit) => {
    submit.preventDefault();
    const email = emailRef.current.value;
    if ((await auth.recoverPassword(email)) === 200) {
      setEmailSendError(false);
      router.push('/recovery/email-sent');
    } else {
      setEmailSendError(true);
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Reset My Password</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={submitHandler}>
            <div>
              <p className="mt-6 text-sm leading-0 text-gray-600">Please enter your account email address. We will send you a link to reset your password.</p>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 pt-2">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  ref={emailRef}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {emailSendError && (
              <div className="flex w-full justify-center rounded-md bg-red-200 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm">
                <p className="m-1 text-center text-sm text-red-500">The email address is incorrect.</p>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
