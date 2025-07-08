const TRACK_MAPPING = {
  FRONTEND: '프론트엔드',
  BACKEND: '백엔드',
  AI_BACKEND: 'AI 백엔드',
  FULL_STACK: '풀스택',
  DATA_SCIENCE: '데이터 분석',
  DATA_ENGINEERING: '데이터 엔지니어링'
};

export const COURSE_NAMES = Object.values(TRACK_MAPPING);
export const BATCH_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

/**
 * 데브코스 과정 API를 한글명으로 변환
 */
export const convertTrackFromApi = (apiTrack) => {
  return TRACK_MAPPING[apiTrack] || apiTrack;
};

/**
 * 과정명을 API로 변환
 */
export const convertTrackToApi = (koreanTrack) => {
  const reverseMapping = Object.fromEntries(
    Object.entries(TRACK_MAPPING).map(([key, value]) => [value, key])
  );
  return reverseMapping[koreanTrack] || koreanTrack;
};

export const getCourseFullName = (courseName, batchNumber) => {
  return `${courseName} ${batchNumber}기`;
};

export const getAllCourses = () => {
  const courses = [];
  COURSE_NAMES.forEach((courseName) => {
    BATCH_NUMBERS.forEach((batchNumber) => {
      courses.push({
        name: courseName,
        batch: batchNumber,
        fullName: getCourseFullName(courseName, batchNumber),
      });
    });
  });
  return courses;
};