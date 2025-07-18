import React, {useState} from "react";
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
const TogetherBoardDetail = ({ post, onLike, onBookmark, boardType, onPostUpdate  }) => {
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(post);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/together/${boardType.toLowerCase()}/${post.id}/edit`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setIsDeleting(true);

    if (boardType === "gathering")      await deleteGatheringPost(post.id);
    else if (boardType === "match")     await deleteMatchingPost(post.id);
    else /* MARKET */                   await deleteMarketPost(post.id);
    alert("삭제되었습니다.");
    navigate(`/together/${boardType}`);
  };

  const handleStatusUpdate = (newStatus) => {
    // 로컬 상태 업데이트
    const updatedPost = { ...currentPost, status: newStatus };
    setCurrentPost(updatedPost);

    // 부모 컴포넌트에 업데이트 알림
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
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
        onStatusUpdate={handleStatusUpdate}
        isDeleting={isDeleting}
      />
      <PostContent post={post} />
    </BoardDetailLayout>
  );
};

export default TogetherBoardDetail;
