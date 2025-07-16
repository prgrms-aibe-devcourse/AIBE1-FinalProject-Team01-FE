import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';

// 2024-2025 트렌드 - 스크롤 트리거 애니메이션

// 스크롤 시 나타나는 애니메이션
export const ScrollReveal = ({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.6,
  y = 50,
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ 
        duration, 
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  );
};

// 스크롤 시 순차적으로 나타나는 애니메이션 (Stagger)
export const ScrollStagger = ({ 
  children, 
  className = '',
  staggerDelay = 0.1,
  duration = 0.6
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
            visible: { 
              opacity: 1, 
              y: 0, 
              filter: 'blur(0px)',
              transition: {
                duration,
                type: 'spring',
                stiffness: 300,
                damping: 30
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// 시차 스크롤 효과 (Parallax)
export const ParallaxScroll = ({ 
  children, 
  className = '',
  speed = 0.5,
  direction = 'vertical'
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], 
    direction === 'vertical' ? ['-50%', '50%'] : ['0%', '0%']
  );
  const x = useTransform(scrollYProgress, [0, 1], 
    direction === 'horizontal' ? ['-50%', '50%'] : ['0%', '0%']
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, x }}
    >
      {children}
    </motion.div>
  );
};

// 스크롤 진행률 표시기
export const ScrollProgress = ({ className = '' }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #007bff, #6610f2)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 1000
      }}
    />
  );
};

// 스크롤 시 나타나는 플로팅 요소
export const FloatingOnScroll = ({ 
  children, 
  className = '',
  offset = 100
}) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, offset], [0, -20]);
  const rotate = useTransform(scrollY, [0, offset], [0, 5]);
  const scale = useTransform(scrollY, [0, offset], [1, 1.05]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, rotate, scale }}
    >
      {children}
    </motion.div>
  );
};

// 스크롤 시 확대되는 이미지
export const ZoomOnScroll = ({ 
  src, 
  alt, 
  className = '',
  maxScale = 1.3
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, maxScale]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ overflow: 'hidden' }}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ scale, width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </motion.div>
  );
};

// 텍스트 타이핑 효과
export const TypewriterEffect = ({ 
  text, 
  className = '',
  speed = 0.05,
  cursor = true
}) => {
  const letters = Array.from(text);
  
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: speed,
            delayChildren: 0.1
          }
        }
      }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
      {cursor && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
};
