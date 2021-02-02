import { Container, Paper, Typography, Button } from '@material-ui/core';
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react';
import GroupItem from './GroupItem';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { listVariants, listItemVariants } from './animationVariants';
import useGroups from '../../lib/useGroups';
import { useAuth } from '../../lib/auth';
import firebase from '../../lib/firebase';

const db = firebase.firestore();

const GroupList = () => {
  const auth = useAuth();
  // State
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hooks
  // const { fetchUserGroupsInfo } = useGroups();

  // Effects
  useEffect(() => {
    const memberships = auth.userData.memberships;
    console.log('Getting group info for: ', memberships);

    memberships.forEach((group) => {
      db.collection('groups')
        .doc(group)
        .get()
        .then((res) => {
          console.log('Got result for:::: ', res.data());

          setUserGroups((userGroups) => [...userGroups, res.data()]);
        });
    });
    setLoading(false);
  }, []);

  return (
    <div>
      <Container maxWidth='md'>
        <Typography
          style={{ paddingBottom: '2rem' }}
          variant='h3'
          color='primary'
        >
          Tus Grupos
        </Typography>
        <Link href='/create-group' passHref>
          <Button component='a'>Crear Grupo</Button>
        </Link>

        {loading
          ? 'loading'
          : userGroups && (
              <div>
                {userGroups.map((group, i) => (
                  <motion.div key={group.name} variants={listItemVariants}>
                    <GroupItem
                      key={i.toString()}
                      groupname={group.name}
                      description={group.shortDescription}
                      author={group.authorDisplay}
                      slug={group.slug}
                    />
                  </motion.div>
                ))}
              </div>
            )}

        {userGroups.length < 1 && (
          <Typography>No eres miembro de ningun grupo 🙃</Typography>
        )}
      </Container>
    </div>
  );
};

export default GroupList;
