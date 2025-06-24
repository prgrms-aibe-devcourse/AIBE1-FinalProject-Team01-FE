import React from "react";
import { ListGroup } from "react-bootstrap";
import { MYPAGE_MENU } from "../../pages/mypage/constants";

/**
 * @typedef {Object} MyPageSidebarProps
 * @property {string} activeMenu
 * @property {function} onMenuChange
 */

/**
 * 마이페이지 사이드바
 * @param {MyPageSidebarProps} props
 */
export const MyPageSidebar = ({ activeMenu, onMenuChange }) => (
  <aside>
    <ListGroup as="ul" className="mb-4">
      <ListGroup.Item as="li" className="fw-bold" disabled>
        내 정보
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "account"}
        onClick={() => onMenuChange("account")}
      >
        계정 관리
      </ListGroup.Item>
      <ListGroup.Item as="li" className="fw-bold" disabled>
        내 활동
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "posts"}
        onClick={() => onMenuChange("posts")}
      >
        작성한 글
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "likes"}
        onClick={() => onMenuChange("likes")}
      >
        좋아요
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "bookmarks"}
        onClick={() => onMenuChange("bookmarks")}
      >
        북마크
      </ListGroup.Item>
      <ListGroup.Item as="li" className="fw-bold" disabled>
        회원 탈퇴
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "withdraw"}
        onClick={() => onMenuChange("withdraw")}
        className="text-danger"
      >
        회원 탈퇴
      </ListGroup.Item>
    </ListGroup>
  </aside>
);
