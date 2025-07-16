import React from 'react';
import { motion } from 'framer-motion';

export const SharedElementTransition = ({ 
  children, 
  layoutId, 
  className = '',
  transition = { 
    type: 'spring', 
    stiffness: 300, 
    damping: 30,
    mass: 0.8
  }
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      transition={transition}
      style={{
        position: 'relative',
        width: '100%'
      }}
    >
      {children}
    </motion.div>
  );
};

// 카드 형태의 공유 요소 전환
export const CardTransition = ({ 
  children, 
  layoutId, 
  className = '',
  whileHover = { 
    scale: 1.02,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    transition: { duration: 0.2 }
  },
  whileTap = { scale: 0.98 }
}) => {
  return (
    <motion.div
      layoutId={layoutId}
      className={className}
      whileHover={whileHover}
      whileTap={whileTap}
      style={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

// 이미지 공유 요소 전환 (갤러리 → 상세보기)
export const ImageTransition = ({ 
  src, 
  alt, 
  layoutId, 
  className = '',
  objectFit = 'cover'
}) => {
  return (
    <motion.img
      layoutId={layoutId}
      src={src}
      alt={alt}
      className={className}
      style={{
        objectFit,
        width: '100%',
        height: '100%'
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25
      }}
    />
  );
};

// 텍스트 공유 요소 전환
export const TextTransition = ({ 
  children, 
  layoutId, 
  className = '',
  as = 'div'
}) => {
  const Component = motion[as];
  
  return (
    <Component
      layoutId={layoutId}
      className={className}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 30
      }}
    >
      {children}
    </Component>
  );
};

// 버튼 공유 요소 전환
export const ButtonTransition = ({ 
  children, 
  layoutId, 
  className = '',
  onClick,
  whileHover = { 
    scale: 1.05,
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
  },
  whileTap = { scale: 0.95 }
}) => {
  return (
    <motion.button
      layoutId={layoutId}
      className={className}
      onClick={onClick}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20
      }}
    >
      {children}
    </motion.button>
  );
};
