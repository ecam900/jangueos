import { useRouter } from 'next/router';
// import { useAuth } from '../lib/auth';

const AuthGuard = ({ children }) => {
  const router = useRouter();

  if (typeof window !== 'undefined' && router.pathname.startsWith('/admin')) {
    console.log(`Detected an ADMIN ROUTE.`);
  }

  return <>{children}</>;
};

export default AuthGuard;
