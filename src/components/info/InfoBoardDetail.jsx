import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { PostContent } from "../common/PostContent";
import { INFO_CATEGORY_LABELS } from "../../pages/info/constants";
import "../../styles/components/info/info.css";
import { deleteInfoPost } from "../../services/infoApi.js";

/**
 * @typedef {Object} Post
 * @property {string | number} postId - 게시글 ID
 * @property {string} boardType - 게시글 타입 (REVIEW, NEWS)
 * @property {string} title - 게시글 제목
 * @property {string} content - 게시글 내용
 * @property {Object} author - 작성자 정보
 * @property {string} createdAt - 작성일
 * @property {number} likeCount - 좋아요 수
 * @property {boolean} isLiked - 현재 사용자의 좋아요 여부
 * @property {number} bookmarkCount - 북마크 수
 * @property {boolean} isBookmarked - 현재 사용자의 북마크 여부
 */

/**
 * @typedef {Object} InfoBoardDetailProps
 * @property {Post} post - 게시글 정보
 * @property {(postId: string | number) => void} onLike - 좋아요 핸들러
 * @property {(postId: string | number) => void} onBookmark - 북마크 핸들러
 */

/**
 * Info 게시글 상세 컴포넌트
 * @param {InfoBoardDetailProps} props
 */
export const InfoBoardDetail = ({ post, onLike, onBookmark }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/info/${post.boardType}/${post.itId}/edit`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      setIsDeleting(true)
      try {
        await deleteInfoPost(post.boardType, post.itId);
        alert("게시글이 삭제되었습니다.");
        navigate(`/info/${post.boardType}`);
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // NEWS는 수정/삭제 불가
  const canEdit = post.boardType === "REVIEW";

  return (
    <>
      <BoardDetailLayout
        post={post}
        likeCount={post.likeCount}
        isLiked={post.isLiked}
        onLike={() => onLike(post.postId)}
        bookmarkCount={post.bookmarkCount}
        isBookmarked={post.isBookmarked}
        onBookmark={() => onBookmark(post.postId)}
      >
        <BoardPostHeader
          post={post}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canEdit ? handleDelete : undefined}
          categoryLabel={INFO_CATEGORY_LABELS[post.boardType]}
          isDeleting = {isDeleting}
        />
        <PostContent post={post} />
      </BoardDetailLayout>
    </>
  );
};
