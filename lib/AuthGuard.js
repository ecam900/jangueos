import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../lib/auth';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const auth = useAuth();

  if (typeof window !== 'undefined' && router.pathname.startsWith('/admin')) {
    console.log(`Detected an ADMIN ROUTE.`);
  }

  // Helper for Email Link Signin
  useEffect(() => {
    console.log('----- AuthGuard Mounted -----');
    auth.finishEmailAuth();
  }, []);

  // Check if user is logged in
  useEffect(() => {
    if (!auth.user && !auth.loading && router.route !== '/login') {
      console.log('AuthGuard could not detect user. Rerouting to login.');
      router.push('/login');
    }
  }, [router.route, auth.loading]);

  // Finalize Login

  return <>{auth.loading ? <LoadingScreen /> : <div>{children}</div>}</>;
};

export default AuthGuard;
