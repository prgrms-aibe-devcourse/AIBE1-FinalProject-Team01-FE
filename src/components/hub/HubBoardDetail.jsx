import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HubPostInfo } from "./HubPostInfo";
import { PostContent } from "../common/PostContent";
import { BoardDetailLayout } from "../board/BoardDetailLayout";
import "../../styles/components/hub/hub.css";

export const HubBoardDetail = ({ post }) => {
  const navigate = useNavigate();
  const { post_images, project } = post;
  const [mainImage, setMainImage] = useState(
    post_images?.[0]?.image_url || null
  );

  const handleEdit = () => {
    navigate(`/hub/write`, { state: { postToEdit: post } }); // 글쓰기 페이지 경로 추후 수정
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      console.log("삭제할 프로젝트 ID:", post.id);
      alert("프로젝트가 삭제되었습니다.");
      navigate(`/hub`);
    }
  };

  return (
    <BoardDetailLayout post={post}>
      <HubPostInfo post={post} onEdit={handleEdit} onDelete={handleDelete} />
      <hr />
      <div className="row g-5 mt-3">
        <div className="col-md-5">
          {post_images && post_images.length > 0 && (
            <>
              <img
                src={mainImage}
                alt={post.title}
                className="img-fluid rounded hub-detail-main-image mb-3"
              />
              {post_images.length > 1 && (
                <div className="d-flex flex-wrap gap-2">
                  {post_images.map((image, index) => (
                    <img
                      key={index}
                      src={image.image_url}
                      alt={`${post.title} thumbnail ${index + 1}`}
                      className={`rounded hub-detail-thumbnail ${
                        mainImage === image.image_url ? "active" : ""
                      }`}
                      onClick={() => setMainImage(image.image_url)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="col-md-7">
          <PostContent post={post} stripImages={true} />
        </div>
      </div>
    </BoardDetailLayout>
  );
};
