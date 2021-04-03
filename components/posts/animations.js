export const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      ease: 'easeIn',
      // when: 'beforeChildren',
      staggerChildren: 0.2,
      delayChildren: 0.3,
      duration: 0.7,
    },
  },
  exit: {
    opacity: 0,
    y: 100,
  },
};

export const listItemVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' },
  },
  exit: {
    opacity: 0,
    y: 100,
  },
};
