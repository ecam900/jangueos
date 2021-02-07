export const listVariants = {
  hidden: {
    opacitiy: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      // ease: 'easeIn',
      // when: 'beforeChildren',
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
    opacitiy: 0,
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
