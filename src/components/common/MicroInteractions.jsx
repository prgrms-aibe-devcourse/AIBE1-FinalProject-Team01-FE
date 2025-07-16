import React from 'react';
import { motion } from 'framer-motion';

// 2024-2025 트렌드 - 마이크로 인터랙션

// 호버 시 확대되는 버튼
export const HoverButton = ({ 
  children, 
  className = '',
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(45deg, #007bff, #0056b3)',
      color: 'white',
      border: 'none'
    },
    secondary: {
      background: 'linear-gradient(45deg, #6c757d, #495057)',
      color: 'white',
      border: 'none'
    },
    success: {
      background: 'linear-gradient(45deg, #28a745, #1e7e34)',
      color: 'white',
      border: 'none'
    }
  };

  return (
    <motion.button
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { 
        scale: 1.05,
        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
        y: -2
      }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25
      }}
      style={{
        ...variants[variant],
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      {children}
    </motion.button>
  );
};

// 클릭 시 파동 효과
export const RippleButton = ({ 
  children, 
  className = '',
  onClick,
  color = '#007bff'
}) => {
  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        backgroundColor: color,
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer'
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0.5 }}
        animate={{ scale: 4, opacity: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.6)',
          pointerEvents: 'none'
        }}
      />
      {children}
    </motion.button>
  );
};

// 호버 시 색상 변화 카드
export const InteractiveCard = ({ 
  children, 
  className = '',
  onClick,
  hoverColor = '#f8f9fa'
}) => {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        backgroundColor: hoverColor,
        boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
        y: -5
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      style={{
        cursor: 'pointer',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: 'white',
        border: '1px solid #e9ecef'
      }}
    >
      {children}
    </motion.div>
  );
};

// 플로팅 액션 버튼
export const FloatingActionButton = ({ 
  children, 
  className = '',
  onClick,
  position = 'bottom-right',
  color = '#007bff'
}) => {
  const positions = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' }
  };

  return (
    <motion.button
      className={className}
      onClick={onClick}
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
        rotate: 5
      }}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25
      }}
      style={{
        position: 'fixed',
        ...positions[position],
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: color,
        color: 'white',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
    </motion.button>
  );
};

// 토글 스위치
export const AnimatedToggle = ({ 
  checked, 
  onChange,
  className = '',
  color = '#007bff'
}) => {
  return (
    <motion.div
      className={className}
      onClick={() => onChange(!checked)}
      style={{
        width: '60px',
        height: '30px',
        backgroundColor: checked ? color : '#ccc',
        borderRadius: '15px',
        padding: '3px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: checked ? 'flex-end' : 'flex-start'
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        layout
        style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'white',
          borderRadius: '50%',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30
        }}
      />
    </motion.div>
  );
};

// 진행률 바
export const AnimatedProgressBar = ({ 
  progress, 
  className = '',
  color = '#007bff',
  height = '8px'
}) => {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height,
        backgroundColor: '#e9ecef',
        borderRadius: height,
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        style={{
          height: '100%',
          backgroundColor: color,
          borderRadius: height
        }}
      />
    </div>
  );
};

// 카운터 애니메이션
export const AnimatedCounter = ({ 
  value, 
  className = '',
  duration = 2
}) => {
  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration }}
      >
        {value}
      </motion.span>
    </motion.span>
  );
};

// 알림 토스트
export const AnimatedToast = ({ 
  message, 
  type = 'info',
  onClose,
  className = ''
}) => {
  const colors = {
    info: '#007bff',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545'
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: colors[type],
        color: 'white',
        padding: '16px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        minWidth: '300px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        <motion.button
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '18px',
            cursor: 'pointer',
            marginLeft: '10px'
          }}
        >
          ×
        </motion.button>
      </div>
    </motion.div>
  );
};

// 로딩 스피너
export const AnimatedSpinner = ({ 
  size = 40,
  color = '#007bff',
  className = ''
}) => {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
      style={{
        width: size,
        height: size,
        border: `4px solid rgba(0,0,0,0.1)`,
        borderTop: `4px solid ${color}`,
        borderRadius: '50%'
      }}
    />
  );
};

// 펄스 효과
export const PulseEffect = ({ 
  children, 
  className = '',
  color = '#007bff',
  duration = 2
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}40`,
          `0 0 0 10px ${color}00`,
          `0 0 0 20px ${color}00`
        ]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeOut'
      }}
      style={{
        borderRadius: '50%',
        display: 'inline-block'
      }}
    >
      {children}
    </motion.div>
  );
};

// 셰이크 효과
export const ShakeEffect = ({ 
  children, 
  className = '',
  trigger = false
}) => {
  return (
    <motion.div
      className={className}
      animate={trigger ? {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
      } : {}}
    >
      {children}
    </motion.div>
  );
};
