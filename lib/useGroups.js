import { useEffect, useState } from 'react';
import { useAuth } from './auth';
import firebase from './firebase';
import slugify from './utils/slugify';

const db = firebase.firestore();

const useGroups = () => {
  const auth = useAuth();
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [userGroups, setUserGroups] = useState([]);

  // Receives object from react-hook-form
  const createGroup = async (values) => {
    setGroupsLoading(true);

    const docName = await slugify(values.name);
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
          members: [auth.user.uid],
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

  // Values come from react-hook-form submission
  const joinGroup = async (values) => {
    const group = db.collection('groups').doc(values.groupID.toString());

    const groupPin = await group.get().then((res) => {
      return res.data().groupCode;
    });

    if (groupPin !== values.pin) {
      return false;
    } else {
      await db
        .collection('users')
        .doc(auth.user.uid.toString())
        .update({
          memberships: firebase.firestore.FieldValue.arrayUnion(
            values.groupID.toString()
          ),
        })
        .catch((err) => {
          console.log('ERROR ADDING MEMBERSHIP TO USER: ', err);
          return err;
        }),
        await group
          .update({
            members: firebase.firestore.FieldValue.arrayUnion(
              auth.user.uid.toString()
            ),
          })
          .catch((err) => {
            console.log('ERROR JOINING GROUP ==> ', error);
            return err;
          });
    }
    return true;
  };

  useEffect(() => {
    if (auth.user) {
      const unsubscribe = db
        .collection('groups')
        .where('members', 'array-contains', auth.user.uid)
        .onSnapshot((snapshot) => {
          let results = [];

          snapshot.forEach((doc) => {
            results.push(doc.data());
          });

          setUserGroups([...userGroups, ...results]);
          console.log('Groups now ==> ', userGroups);
        });

      return () => unsubscribe();
    }
  }, [auth.user]);

  return {
    createGroup,
    userGroups,
    groupsLoading,
    fetchGroups,
    joinGroup,
  };
};

export default useGroups;
