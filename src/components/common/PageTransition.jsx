import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// 페이지 전환 효과를 비활성화할 경로들
const shouldSkipTransition = (currentPath, previousPath) => {
  // 이전 경로가 없으면 전환 효과 적용
  if (!previousPath) return false;
  
  // 커뮤니티 내 탭 전환 (예: /community/free ↔ /community/qna)
  const communityTabPattern = /^\/community\/[^\/]+$/;
  if (communityTabPattern.test(currentPath) && communityTabPattern.test(previousPath)) {
    return true;
  }
  
  // 정보게시판 내 탭 전환 (예: /info/review ↔ /info/job)
  const infoTabPattern = /^\/info\/[^\/]+$/;
  if (infoTabPattern.test(currentPath) && infoTabPattern.test(previousPath)) {
    return true;
  }
  
  // 함께해요 내 탭 전환 (예: /together/gathering ↔ /together/study)
  const togetherTabPattern = /^\/together\/[^\/]+$/;
  if (togetherTabPattern.test(currentPath) && togetherTabPattern.test(previousPath)) {
    return true;
  }
  
  return false;
};

// 페이드 인 효과만 (페이드 아웃 제거)
const pageVariants = {
  initial: {
    opacity: 0
  },
  in: {
    opacity: 1
  }
};

// 페이드 인 트랜지션
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

export const PageTransition = ({ children }) => {
  const location = useLocation();
  const previousPathRef = React.useRef(null);
  
  // 탭 전환인지 확인
  const skipTransition = shouldSkipTransition(location.pathname, previousPathRef.current);
  
  // 현재 경로를 이전 경로로 저장 (다음 렌더링에서 사용)
  React.useEffect(() => {
    previousPathRef.current = location.pathname;
  }, [location.pathname]);
  
  if (skipTransition) {
    // 탭 전환일 때는 애니메이션 없이 바로 렌더링
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        {children}
      </div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          position: 'relative',
          width: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 로딩 애니메이션도 페이드 인만
export const LoadingTransition = ({ isLoading, children }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
