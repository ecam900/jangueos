import { Container, Paper, Typography, Button } from '@material-ui/core';
import { Router } from 'next/router';
import React, { useEffect } from 'react';
import GroupItem from './GroupItem';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { listVariants, listItemVariants } from './animationVariants';

const GroupList = ({ userGroups, groupsLoading }) => {
  useEffect(() => {
    console.log('GROUPS ISSSSS => ', userGroups);
  }, []);

  return (
    <div>
      {!groupsLoading && (
        <Container maxWidth='md'>
          {/* <Paper style={{ padding: '2rem' }}> */}
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

          {userGroups && (
            <motion.div
              key='group-list'
              variants={listVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              {userGroups.map((group) => (
                <motion.div key={group.name} variants={listItemVariants}>
                  <GroupItem
                    key={group.name}
                    groupname={group.name}
                    description={group.shortDescription}
                    author={group.authorDisplay}
                    slug={group.slug}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          {/* </Paper> */}
        </Container>
      )}
    </div>
  );
};

export default GroupList;
