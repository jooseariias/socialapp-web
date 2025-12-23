import { usePostActions } from '../Hooks/usePostActions'

import PostDetailModal from './modals/PostDetailModal'
import ModalDeleteComement from './modals/modalDeleteComement'
import CardPost from './Card/CardPost'

const FeedPostCard = ({ post, onCommentUpdate }) => {
  const {
    expanded,
    setExpanded,
    liked,
    bookmarked,
    setBookmarked,
    showModal,
    setShowModal,
    showComments,
    setShowComments,
    comment,
    setComment,
    loading,
    commentLoading,
    showDeleteConfirm,
    deleteLoading,
    comments,
    commentsEndRef,
    truncate,
    formatDate,
    handleLike,
    handleAddComment,
    currentUser,
    isCurrentUserComment,
    postImage,
    postContent,
    postUser,
    postLikes,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    deleteComment,
  } = usePostActions(post, onCommentUpdate)
  return (
    <>
      <CardPost
        expanded={expanded}
        setExpanded={setExpanded}
        liked={liked}
        bookmarked={bookmarked}
        setBookmarked={setBookmarked}
        setShowModal={setShowModal}
        showComments={showComments}
        setShowComments={setShowComments}
        comment={comment}
        setComment={setComment}
        loading={loading}
        commentLoading={commentLoading}
        showDeleteConfirm={showDeleteConfirm}
        deleteLoading={deleteLoading}
        comments={comments}
        commentsEndRef={commentsEndRef}
        truncate={truncate}
        formatDate={formatDate}
        handleLike={handleLike}
        handleAddComment={handleAddComment}
        currentUser={currentUser}
        isCurrentUserComment={isCurrentUserComment}
        postImage={postImage}
        postContent={postContent}
        postUser={postUser}
        postLikes={postLikes}
        handleDeleteClick={handleDeleteClick}
        post={post}
      />

      <PostDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        post={post}
        comments={comments}
        currentUser={currentUser}
        onAddComment={handleAddComment}
        onDeleteClick={deleteComment}
        liked={liked}
        handleLike={handleLike}
        showModal={showModal}
        setShowModal={setShowModal}
        postImage={postImage}
        postUser={postUser}
        postLikes={postLikes}
        formatDate={formatDate}
        comment={comment}
        setComment={setComment}
        handleAddComment={handleAddComment}
        isCurrentUserComment={isCurrentUserComment}
        postContent={postContent}
        handleDeleteClick={handleDeleteClick}
      />

      <ModalDeleteComement
        showDeleteConfirm={showDeleteConfirm}
        handleCancelDelete={handleCancelDelete}
        handleConfirmDelete={handleConfirmDelete}
        deleteLoading={deleteLoading}
      />
    </>
  )
}

export default FeedPostCard
