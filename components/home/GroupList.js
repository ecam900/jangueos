import { Container, Paper, Typography, Button } from '@material-ui/core';
import { Router } from 'next/router';
import React, { useEffect, useState } from 'react';
import GroupItem from './GroupItem';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { listVariants, listItemVariants } from './animationVariants';
import useGroups from '../../lib/useGroups';
import { useAuth } from '../../lib/auth';
import firebase from '../../lib/firebase';

const GroupList = ({ open, setOpen }) => {
  const auth = useAuth();
  const groups = useGroups();
  // State

  const { userGroups } = groups;

  return (
    <div>
      <Container maxWidth='md'>
        <Typography style={{ paddingBottom: '2rem' }} variant='h4'>
          Membresias
        </Typography>

        <Button onClick={() => setOpen(!open)}>UNETE A UN GRUPO</Button>
        {auth.userData.role.admin && (
          <Link href='/create-group' passHref>
            <Button component='a'>CREAR GRUPO</Button>
          </Link>
        )}
        <AnimatePresence exitBeforeEnter>
          {userGroups.length > 0 && (
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
          )}

          {userGroups.length < 1 && (
            <motion.div exit={{ opacity: 0 }}>
              <Typography>No eres miembro de ningun grupo 🙃</Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default GroupList;
