import { useRouter } from 'next/router';

export default function Nav() {
  const router = useRouter();
  const route = router.pathname.substring(1);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 capitalize">{route}</h1>
      </div>
    </header>
  );
}
