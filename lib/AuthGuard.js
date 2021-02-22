import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../lib/auth';

const AuthGuard = ({ children }) => {
  const router = useRouter();
  const auth = useAuth();

  const { id } = router.query;

  const checkMembership = (groupId) => {
    const userMemberships = auth.userData.memberships;
    if (!userMemberships.includes(groupId)) {
      console.log('NOT A MEMBER!');
    } else {
      console.log('MEMBERSHIP FOUND!');
    }
  };

  //  Group ID from URL - this way I can check if access to group is allowed.
  useEffect(() => {
    if (id && auth.userData) {
      checkMembership(id);
    }
  }, [id]);

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

  // Check if user has access to the group.
  useEffect(() => {}, []);

  return <>{auth.loading ? <LoadingScreen /> : <>{children}</>}</>;
};

export default AuthGuard;
