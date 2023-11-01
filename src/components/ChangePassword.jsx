import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@hooks/useAuth';
export default function ChangePasswordPage() {
  const passwordRef = useRef(null);
  const password2Ref = useRef(null);
  const auth = useAuth();
  const router = useRouter();
  const [passwordDoNotMatch, setPasswordDoNotMatch] = useState(false);
  const submitHandler = async (submit) => {
    submit.preventDefault();
    const password = passwordRef.current.value;
    const password2 = password2Ref.current.value;
    const { token } = router.query;
    if (password === password2) {
      setPasswordDoNotMatch(false);
    } else {
      setPasswordDoNotMatch(true);
      return;
    }
    const changePass = async () => {
      const status = await auth.changePassword(token, password);
      if (status === 200) {
        router.push('/recovery/change-password/success');
      } else {
        router.push('/recovery/change-password/failure');
      }
      return status;
    };
    changePass();
  };
  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Now you can change your password</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={submitHandler}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength="8"
                  required
                  ref={passwordRef}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password2"
                  name="password2"
                  type="password"
                  minLength="8"
                  required
                  ref={password2Ref}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            {passwordDoNotMatch && (
              <div className="flex w-full justify-center rounded-md bg-red-200 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm">
                <p className="m-1 text-center text-sm text-red-500">Passwords do not match.</p>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Change my password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
