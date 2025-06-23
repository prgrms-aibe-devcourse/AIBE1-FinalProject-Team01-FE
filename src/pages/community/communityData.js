export const posts = [
  {
    id: 1,
    user_id: 1,
    board_type: "community",
    category: "free",
    title: "요즘 아침에 수업듣기 너무 빡세네요",
    content:
      '아침에 일어나기 너무 힘들어요... 다들 어떻게 극복하시나요?<p><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLlkP9EXGiropFvkyGVSJiQDkC3o8huVh06NIu0s4LHyTy_sTToM9vn2xKF5HwqFDF4A&usqp=CAU" alt="Tired student"></p><p>특히 9시 수업이 가장 힘든데, 여러분들은 어떤 방법으로 아침 기상을 하시나요? </p> <p> <img src="https://t4.ftcdn.net/jpg/02/66/72/41/360_F_266724133_uJj0HlXvsmFltJo5YDOVSG6p4Y8sQiZB.jpg">  </p> <p> 알람을 여러 개 맞춰놔도 계속 꺼버리게 되네요. 좋은 팁이 있다면 공유 부탁드립니다!</p>',
    user: {
      id: 1,
      nickname: "김루이지",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "프론트엔드",
    },
    created_at: "2024-12-19T14:30:00Z",
    updated_at: "2024-12-19T14:30:00Z",
    tags: ["피곤함", "데브코스", "아침수업"],
    like_count: 24,
    view_count: 157,
    is_deleted: false,
    post_images: [
      {
        image_url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZLlkP9EXGiropFvkyGVSJiQDkC3o8huVh06NIu0s4LHyTy_sTToM9vn2xKF5HwqFDF4A&usqp=CAU",
      },
    ],
    bookmarked: false,
    comments: [
      {
        id: 1,
        user_id: 4,
        post_id: 1,
        parent_comment_id: null,
        content:
          "저도 똑같은 고민이에요! 알람 15개씩 맞춰놔도 다 꺼버리게 되더라고요 ㅠㅠ",
        like_count: 3,
        is_deleted: false,
        created_at: "2024-12-19T15:00:00Z",
        updated_at: "2024-12-19T15:00:00Z",
        user: {
          id: 4,
          nickname: "이민수",
          image_url: "https://via.placeholder.com/40",
          devcourse_name: "프론트엔드",
        },
        replies: [],
      },
      {
        id: 2,
        user_id: 5,
        post_id: 1,
        parent_comment_id: null,
        content:
          "알람 앱을 바꿔보세요! 수학 문제 풀어야 꺼지는 앱 써보니까 효과 있더라고요",
        like_count: 8,
        is_deleted: false,
        created_at: "2024-12-19T15:30:00Z",
        updated_at: "2024-12-19T15:30:00Z",
        user: {
          id: 5,
          nickname: "박수진",
          image_url: "https://via.placeholder.com/40",
          devcourse_name: "데이터분석",
        },
        replies: [
          {
            id: 3,
            user_id: 1,
            post_id: 1,
            parent_comment_id: 2,
            content: "오 좋은 아이디어네요! 앱 이름 알려주실 수 있을까요?",
            like_count: 1,
            is_deleted: false,
            created_at: "2024-12-19T16:00:00Z",
            updated_at: "2024-12-19T16:00:00Z",
            user: {
              id: 1,
              nickname: "김루이지",
              image_url: "https://via.placeholder.com/40",
              devcourse_name: "프론트엔드",
            },
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    user_id: 2,
    board_type: "community",
    category: "qna",
    title: "React Hook Form vs Formik 비교 분석해봤어요",
    content:
      "<p>둘 다 써보니 장단점이 확실히 있네요. 여러분은 어떤 걸 선호하시나요?</p><p>프로젝트를 진행하면서 두 라이브러리를 모두 사용해봤는데, 각각의 장단점이 뚜렷하더라고요.</p> <p>React Hook Form: 성능이 좋고 리렌더링이 적음</p> <p>Formik: 문서화가 잘 되어있고 커뮤니티가 활발함</p> <p>Hook Form: TypeScript 지원이 더 우수함</p> <p>Formik: 복잡한 폼 validation에 유리함</p>",
    user: {
      id: 2,
      nickname: "홍길동",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "백엔드",
    },
    created_at: "2024-12-19T06:30:00Z",
    updated_at: "2024-12-19T06:30:00Z",
    tags: ["React", "Hook", "비교", "분석"],
    like_count: 10,
    view_count: 1457,
    is_deleted: false,
    post_images: [],
    bookmarked: false,
    comments: [
      {
        id: 4,
        user_id: 6,
        post_id: 2,
        parent_comment_id: null,
        content: "저는 Hook Form 파입니다. 성능 차이가 확실히 느껴져요!",
        like_count: 5,
        is_deleted: false,
        created_at: "2024-12-19T07:00:00Z",
        updated_at: "2024-12-19T07:00:00Z",
        user: {
          id: 6,
          nickname: "최개발",
          image_url: "https://via.placeholder.com/40",
          devcourse_name: "프론트엔드",
        },
        replies: [],
      },
    ],
  },
  {
    id: 3,
    user_id: 3,
    board_type: "community",
    category: "retrospect",
    title: "첫 프로젝트 회고: 실패와 성공의 경험담",
    content:
      "<p>리액트 어렵네요... 하지만 포기하지 않고 끝까지 해냈습니다.</p><p>처음에는 정말 막막했는데, 하나씩 배워가면서 조금씩 이해가 되기 시작했어요. 특히 컴포넌트 구조를 잡는 게 가장 어려웠던 것 같습니다.</p>",
    user: {
      id: 3,
      nickname: "박개발",
      image_url: "https://via.placeholder.com/40",
      devcourse_name: "생성형 AI 백엔드",
    },
    created_at: "2024-12-18T15:20:00Z",
    updated_at: "2024-12-18T15:20:00Z",
    tags: ["회고", "프로젝트", "성장"],
    like_count: 32,
    view_count: 892,
    is_deleted: false,
    post_images: [],
    bookmarked: false,
    comments: [
      {
        id: 5,
        user_id: 7,
        post_id: 3,
        parent_comment_id: null,
        content:
          "포기하지 않고 끝까지 하신 게 정말 대단해요! 계속 화이팅하세요 💪",
        like_count: 12,
        is_deleted: false,
        created_at: "2024-12-18T16:00:00Z",
        updated_at: "2024-12-18T16:00:00Z",
        user: {
          id: 7,
          nickname: "김멘토",
          image_url: "https://via.placeholder.com/40",
          devcourse_name: "AI 엔지니어링",
        },
        replies: [],
      },
    ],
  },
];

/**
 * 더미 댓글/답글 생성 함수
 * @param {string} content
 * @returns {object}
 */
export function createDummyComment(content) {
  return {
    id: Date.now() + Math.random(),
    author: "익명",
    authorProfileImg: "https://via.placeholder.com/32",
    devcourseName: null,
    date: new Date().toLocaleString(),
    content,
    likes: 0,
    replies: [],
  };
}
