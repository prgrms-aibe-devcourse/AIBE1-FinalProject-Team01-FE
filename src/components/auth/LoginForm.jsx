import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 백엔드 인증 요청
    login(); // 상태 업데이트
    navigate("/");
  };

  return (
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="userId">아이디</label>
        <input
          id="userId"
          name="userId"
          type="text"
          placeholder="아이디를 입력하세요"
        />
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
        />
        <button type="submit" className="login-btn">
          로그인
        </button>
      </form>
    </div>
  );
};
