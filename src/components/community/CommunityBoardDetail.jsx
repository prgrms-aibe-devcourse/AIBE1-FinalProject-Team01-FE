import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import { BoardPostHeader } from "../board/BoardPostHeader";
import { PostContent } from "../common/PostContent";
import { BOARD_TYPE_LABEL } from "../../pages/community/constants";
import "../../styles/components/community/community.css";
import { deleteCommunityPost } from "../../services/communityApi.js"

/**
 * @typedef {Object} Post
 * @property {string | number} communityId - 게시글 ID
 * @property {string | number} postId - 게시글 ID
 * @property {string} boardType - 게시글 타입 (FREE, QNA, RETROSPECT)
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
 * @typedef {Object} CommunityBoardDetailProps
 * @property {Post} post - 게시글 정보
 * @property {(postId: string | number) => void} onLike - 좋아요 핸들러
 * @property {(postId: string | number) => void} onBookmark - 북마크 핸들러
 */

/**
 * 커뮤니티 게시글 상세 컴포넌트
 * @param {CommunityBoardDetailProps} props
 */
export const CommunityBoardDetail = ({ post, onLike, onBookmark }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/community/${post.boardType}/${post.communityId}/edit`, {
      state: { postToEdit: post },
    });
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      setIsDeleting(true);
      await deleteCommunityPost(post.boardType, post.communityId);
      alert("게시글이 삭제되었습니다.")
      navigate(`/community/${post.boardType}`);
    }
  };

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
          boardType = {post.boardType}
          onEdit={handleEdit}
          onDelete={handleDelete}
          categoryLabel={BOARD_TYPE_LABEL[post.boardType]}
          isDeleting={isDeleting}
        />
        <PostContent post={post} />
      </BoardDetailLayout>
    </>
  );
};
