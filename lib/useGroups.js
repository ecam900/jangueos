import { useState } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';

const useGroups = () => {
  const db = firebase.firestore();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  // Receives object from react-hook-form
  const createGroup = async (values) => {
    setLoading(true);

    const docName = values.name.split(' ').join('_');
    return await db
      .collection('groups')
      .doc(docName)
      .set(
        {
          name: values.name,
          shortDescription: values.shortDescription,
          description: values.description,
          author: auth.user.uid,
          authorDisplay: auth.userData.username,
          members: [auth.userData.email],
          slug: docName,
        },
        { merge: true }
      )
      .then(() => {
        console.log('Done Creating Group');
        const memberships = auth.userData.memberships ?? [];
        const newMemberships = [...memberships, docName];
        db.collection('users')
          .doc(auth.user.uid)
          .set({ memberships: newMemberships }, { merge: true })
          .then(() => {
            console.log('User membership saved');
          })
          .catch((err) => {
            console.log('ERROR SAVING USER DATA: ', err);
            setLoading(false);
          });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(`ERROR: ${err}`);
        setLoading(false);
      });
  };

  const fetchGroups = async () => {
    const userEmail = auth.userData.email;
    return await db
      .collection('groups')
      .where('members', 'array-contains', userEmail)
      .get()
      .then((snapshot) => {
        let results = [];
        snapshot.forEach((doc) => {
          results.push(doc.data());
        });
        console.log('FETCHED RESULTS: ', results);
        return results;
      })
      .catch((err) => {
        console.log('ERROR: ', err);
      });
  };

  return {
    createGroup,
    loading,
    fetchGroups,
  };
};

export default useGroups;
