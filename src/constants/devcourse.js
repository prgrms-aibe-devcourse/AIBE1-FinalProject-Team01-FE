export const COURSE_NAMES = [
  "생성형 AI 백엔드",
  "클라우드 백엔드",
  "풀스택",
  "프론트엔드",
  "데이터",
  "데이터 분석",
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
