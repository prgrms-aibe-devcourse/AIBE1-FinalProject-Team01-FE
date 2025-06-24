import React from "react";
import { Button } from "react-bootstrap";

export default function WithdrawPage() {
  const handleWithdraw = () => {
    if (
      window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      alert("탈퇴 처리되었습니다.");
    }
  };
  return (
    <div className="card p-4">
      <h5 className="mb-3 text-danger">회원 탈퇴</h5>
      <div
        className="mb-3"
        style={{
          background: "#fff0f0",
          border: "1px solid #ffcccc",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <ul className="mb-0 text-danger" style={{ fontSize: 15 }}>
          <li>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</li>
          <li>
            작성한 글, 댓글, 좋아요, 북마크 등 모든 활동 내역이 삭제됩니다.
          </li>
          <li>탈퇴 후 동일 이메일로 재가입이 제한될 수 있습니다.</li>
        </ul>
      </div>
      <div className="d-flex justify-content-end">
        <Button variant="danger" onClick={handleWithdraw}>
          회원 탈퇴
        </Button>
      </div>
    </div>
  );
}
