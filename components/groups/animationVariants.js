export const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      ease: 'easeIn',
      when: 'beforeChildren',
      staggerChildren: 0.1,
      delayChildren: 1,
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
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    y: 100,
  },
};
