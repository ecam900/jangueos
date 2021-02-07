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
  const groups = useGroups();
  // State

  const { userGroups } = groups;
  // Effects

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
        <motion.div
          key={'group-key'}
          initial='hidden'
          animate='visible'
          variants={listVariants}
          exit='exit'
        >
          {userGroups.map((group, i) => (
            <motion.div
              initial='hidden'
              animate='visible'
              exit='exit'
              key={i}
              variants={listItemVariants}
            >
              <GroupItem
                groupname={group.name}
                description={group.shortDescription}
                author={group.authorDisplay}
                slug={group.slug}
              />
            </motion.div>
          ))}
        </motion.div>
        {userGroups.length < 1 && (
          <Typography>No eres miembro de ningun grupo 🙃</Typography>
        )}
      </Container>
    </div>
  );
};

export default GroupList;
