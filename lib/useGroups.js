import { useState } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';

const useGroups = () => {
  const db = firebase.firestore();
  const auth = useAuth();
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [userGroups, setUserGroups] = useState(null);

  // Receives object from react-hook-form
  const createGroup = async (values) => {
    setGroupsLoading(true);

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
            setGroupsLoading(false);
          });
        setGroupsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        console.log(`ERROR: ${err}`);
        setGroupsLoading(false);
      });
  };

  const fetchGroups = async () => {
    if (auth?.userData) {
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
    }
  };

  const fetchUserGroupsInfo = async () => {
    if (auth?.userData) {
      const groups = [];
      auth.userData.memberships.forEach((groupId) => {
        db.collection('groups')
          .doc(groupId)
          .get()
          .then((res) => {
            console.log(res.data());
            groups.push(res.data());
          })
          .catch((err) => {
            console.log('Error: ', err);

            return err;
          });
      });

      return groups;
    }
  };

  return {
    createGroup,
    groupsLoading,
    fetchGroups,
    fetchUserGroupsInfo,
    fetchUserGroupsInfo,
  };
};

export default useGroups;
