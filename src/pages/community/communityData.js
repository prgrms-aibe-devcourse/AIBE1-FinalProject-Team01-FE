export const CATEGORY_MAP = {
  free: "자유게시판",
  qna: "Q&A",
  blog: "블로그/회고",
};
export const CATEGORY_KEYS = Object.keys(CATEGORY_MAP);

export const DUMMY_POSTS = [
  {
    id: 1,
    category: "free",
    title: "요즘 아침에 수업듣기 너무 빡세네요",
    content:
      "아침에 일어나기 너무 힘들어요... 다들 어떻게 극복하시나요?\n\n특히 9시 수업이 가장 힘든데, 여러분들은 어떤 방법으로 아침 기상을 하시나요? 알람을 여러 개 맞춰놔도 계속 꺼버리게 되네요. 좋은 팁이 있다면 공유 부탁드립니다!",
    author: "김루이지",
    authorProfileImg: "https://via.placeholder.com/40",
    devcourseName: "프론트엔드",
    time: "2시간 전",
    date: "2024-12-19 14:30",
    tags: ["#피곤함", "#데브코스", "#아침수업"],
    likes: 24,
    comments: 5,
    views: 157,
    image: null,
    contentList: null,
    commentList: [
      {
        id: 1,
        author: "이민수",
        authorProfileImg: "https://via.placeholder.com/40",
        devcourseName: "프론트엔드",
        date: "2024-12-19 15:00",
        content:
          "저도 똑같은 고민이에요! 알람 15개씩 맞춰놔도 다 꺼버리게 되더라고요 ㅠㅠ",
        likes: 3,
        replies: [],
      },
      {
        id: 2,
        author: "박수진",
        authorProfileImg: "https://via.placeholder.com/40",
        devcourseName: "데이터분석",
        date: "2024-12-19 15:30",
        content:
          "알람 앱을 바꿔보세요! 수학 문제 풀어야 꺼지는 앱 써보니까 효과 있더라고요",
        likes: 8,
        replies: [
          {
            id: 3,
            author: "김루이지",
            authorProfileImg: "https://via.placeholder.com/40",
            date: "2024-12-19 16:00",
            content: "오 좋은 아이디어네요! 앱 이름 알려주실 수 있을까요?",
            likes: 1,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    category: "qna",
    title: "React Hook Form vs Formik 비교 분석해봤어요",
    content:
      "둘 다 써보니 장단점이 확실히 있네요. 여러분은 어떤 걸 선호하시나요?\n\n프로젝트를 진행하면서 두 라이브러리를 모두 사용해봤는데, 각각의 장단점이 뚜렷하더라고요.",
    author: "홍길동",
    authorProfileImg: "https://via.placeholder.com/40",
    devcourseName: "백엔드",
    time: "10시간 전",
    date: "2024-12-19 06:30",
    tags: ["#React", "#Hook", "#비교", "#분석"],
    likes: 10,
    comments: 15,
    views: 1457,
    image: null,
    contentList: [
      "React Hook Form: 성능이 좋고 리렌더링이 적음",
      "Formik: 문서화가 잘 되어있고 커뮤니티가 활발함",
      "Hook Form: TypeScript 지원이 더 우수함",
      "Formik: 복잡한 폼 validation에 유리함",
    ],
    commentList: [
      {
        id: 1,
        author: "최개발",
        authorProfileImg: "https://via.placeholder.com/40",
        date: "2024-12-19 07:00",
        content: "저는 Hook Form 파입니다. 성능 차이가 확실히 느껴져요!",
        likes: 5,
        replies: [],
      },
    ],
  },
  {
    id: 3,
    category: "blog",
    title: "첫 프로젝트 회고: 실패와 성공의 경험담",
    content:
      "리액트 어렵네요... 하지만 포기하지 않고 끝까지 해냈습니다.\n\n처음에는 정말 막막했는데, 하나씩 배워가면서 조금씩 이해가 되기 시작했어요. 특히 컴포넌트 구조를 잡는 게 가장 어려웠던 것 같습니다.",
    author: "박개발",
    authorProfileImg: "https://via.placeholder.com/40",
    devcourseName: "생성형 AI 백엔드",
    time: "1일 전",
    date: "2024-12-18 15:20",
    tags: ["#회고", "#프로젝트", "#성장"],
    likes: 32,
    comments: 8,
    views: 892,
    image: null,
    contentList: null,
    commentList: [
      {
        id: 1,
        author: "김멘토",
        authorProfileImg: "https://via.placeholder.com/40",
        date: "2024-12-18 16:00",
        content:
          "포기하지 않고 끝까지 하신 게 정말 대단해요! 계속 화이팅하세요 💪",
        likes: 12,
        replies: [],
      },
    ],
  },
];
