export const COURSE_NAMES = [
  "프론트엔드",
  "백엔드", 
  "AI 백엔드",
  "풀스택",
  "데이터 분석",
  "데이터 엔지니어링",
];

export const BATCH_NUMBERS = Array.from({ length: 10 }, (_, i) => i + 1);

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

export const convertTrackFromApi = (track) => {
  switch (track) {
    case 'FRONTEND':
      return '프론트엔드';
    case 'BACKEND':
      return '백엔드';
    case 'AI_BACKEND':
      return 'AI 백엔드';
    case 'FULL_STACK':
      return '풀스택';
    case 'DATA_SCIENCE':
      return '데이터 분석';
    case 'DATA_ENGINEERING':
      return '데이터 엔지니어링';
    default:
      return track;
  }
};

export const convertTrackToApi = (koreanTrack) => {
  switch (koreanTrack) {
    case '프론트엔드':
      return 'FRONTEND';
    case '백엔드':
      return 'BACKEND';
    case 'AI 백엔드':
      return 'AI_BACKEND';
    case '풀스택':
      return 'FULL_STACK';
    case '데이터 분석':
      return 'DATA_SCIENCE';
    case '데이터 엔지니어링':
      return 'DATA_ENGINEERING';
    default:
      return koreanTrack;
  }
};