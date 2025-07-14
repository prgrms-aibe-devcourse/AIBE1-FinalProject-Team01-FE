import React from "react";
import { useNavigate } from "react-router-dom";
import { PostContent } from "../common/PostContent";
import TogetherPostInfo from "./TogetherPostInfo";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { deleteGatheringPost } from "../../services/together/gatheringApi";
import { deleteMatchingPost } from "../../services/together/matchingApi";
import { deleteMarketPost } from "../../services/together/marketApi";

/**
 * @typedef {Object} TogetherBoardDetailProps
 * @property {object} post - 게시글 정보 (좋아요, 북마크 상태 포함)
 * @property {function} onLike - 좋아요 토글 핸들러
 * @property {function} onBookmark - 북마크 토글 핸들러
 */

/**
 * 함께해요 글 상세 메인 컴포넌트
 * @param {TogetherBoardDetailProps} props
 */
const TogetherBoardDetail = ({ post, onLike, onBookmark, boardType }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/together/${boardType.toLowerCase()}/${post.id}/edit`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    if (boardType === "gathering")      await deleteGatheringPost(post.id);
    else if (boardType === "match")     await deleteMatchingPost(post.id);
    else /* MARKET */                   await deleteMarketPost(post.id);
    alert("삭제되었습니다.");
    navigate(`/together/${boardType}`);
  };

  if (!post) {
    return <div>게시글 정보를 불러오는 중입니다...</div>;
  }

  return (
    <BoardDetailLayout
      post={post}
      likeCount={post.likeCount}
      isLiked={post.isLiked}
      onLike={onLike}
      bookmarkCount={post.bookmarkCount}
      isBookmarked={post.isBookmarked}
      onBookmark={onBookmark}
      boardTitle="함께해요"
      boardLink="/together"
    >
      <TogetherPostInfo
        post={post}
        onEdit={handleEdit}
        onDelete={handleDelete}
        boardType={boardType}
      />
      <PostContent post={post} />
    </BoardDetailLayout>
  );
};

export default TogetherBoardDetail;
