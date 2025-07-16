import React from "react";
import { ListGroup } from "react-bootstrap";
import { MYPAGE_MENU } from "../../pages/mypage/constants";
import "../../styles/components/mypage/mypage.css";
import { Person, Activity, BoxArrowRight } from "react-bootstrap-icons";

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
  <aside className="mypage-sidebar">
    <ListGroup as="ul" className="mb-4">
      <ListGroup.Item as="li" className="sidebar-section" disabled>
        <Person size={18} /> 내 정보
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "account"}
        onClick={() => onMenuChange("account")}
        className={`sidebar-item${activeMenu === "account" ? " active" : ""}`}
      >
        계정 관리
      </ListGroup.Item>
      <ListGroup.Item
          as="li"
          action
          active={activeMenu === "following"}
          onClick={() => onMenuChange("following")}
          className={`sidebar-item${activeMenu === "following" ? " active" : ""}`}
      >
        팔로잉 목록
      </ListGroup.Item>
      <ListGroup.Item as="li" className="sidebar-section" disabled>
        <Activity size={18} /> 나의 활동
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "posts"}
        onClick={() => onMenuChange("posts")}
        className={`sidebar-item${activeMenu === "posts" ? " active" : ""}`}
      >
        작성한 글
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "likes"}
        onClick={() => onMenuChange("likes")}
        className={`sidebar-item${activeMenu === "likes" ? " active" : ""}`}
      >
        좋아요 글
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "bookmarks"}
        onClick={() => onMenuChange("bookmarks")}
        className={`sidebar-item${activeMenu === "bookmarks" ? " active" : ""}`}
      >
        북마크 글
      </ListGroup.Item>
      <ListGroup.Item
          as="li"
          action
          active={activeMenu === "follow"}
          onClick={() => onMenuChange("follow")}
          className={`sidebar-item${activeMenu === "follow" ? " active" : ""}`}
      >
        팔로우 글
      </ListGroup.Item>
      <ListGroup.Item
        as="li"
        className="sidebar-section"
        disabled
      ></ListGroup.Item>
      <ListGroup.Item
        as="li"
        action
        active={activeMenu === "withdraw"}
        onClick={() => onMenuChange("withdraw")}
        className={`sidebar-item text-danger${
          activeMenu === "withdraw" ? " active" : ""
        }`}
      >
        <BoxArrowRight size={16} style={{ marginRight: 4, marginBottom: 2 }} />{" "}
        회원 탈퇴
      </ListGroup.Item>
    </ListGroup>
  </aside>
);
