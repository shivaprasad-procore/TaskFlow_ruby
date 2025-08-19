import React, { useState, useEffect, useMemo } from 'react';
import APIService from '../services/api';
import './ActivityFeed.css';

/**
 * Controlled comments sidebar:
 * - No new buttons are added inside this component.
 * - Open it with your EXISTING button by passing isOpen=true.
 * - Close it by calling onClose() (e.g., from backdrop or header close).
 *
 * Props:
 * - task (object): the task to show comments for
 * - isOpen (bool): controls visibility of the sidebar
 * - onClose (func): called when user clicks backdrop or the close "×"
 */
const ActivityFeed = ({ task, isOpen = false, onClose = () => {} }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const normalizeComment = (c) => ({
    id: c.id ?? c._id ?? `${(c.userName || c.user_name || 'user')}-${(c.created_at || c.create_at || c.createdAt || Date.now())}`,
    userName: c.userName || c.user_name || c.user || 'Unknown',
    comment: c.comment || c.text || '',
    createdAt: c.created_at || c.create_at || c.createdAt || c.created || null,
  });

  const commentCount = useMemo(() => comments.length, [comments]);

  useEffect(() => {
    if (!(isOpen && task?.id)) return;
    setLoadingComments(true);
    APIService.getCommentsForTask(task.id)
      .then((response) => {
        if (response?.success) {
          const list = Array.isArray(response.data) ? response.data : [];
          setComments(list.map(normalizeComment));
        }
      })
      .finally(() => setLoadingComments(false));
  }, [isOpen, task]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    if (!task?.assignee || task.assignee === 'None') {
      alert('Please select an Assignee for the task before commenting.');
      return;
    }

    const commentData = { userName: task.assignee, comment: newComment.trim() };
    const response = await APIService.createComment(task.id, commentData);
    if (response?.success) {
      const normalized = normalizeComment({
        ...(response.data || {}),
        created_at: response?.data?.created_at || response?.data?.create_at || new Date().toISOString(),
      });
      setComments((prev) => [...prev, normalized]);
      setNewComment('');
    } else {
      alert(`Failed to post comment: ${response?.error || 'Unknown error'}`);
    }
  };

  const formatCommentTime = (dateString) => {
    if (!dateString) return { timeOnly: '', full: '' };
    const date = new Date(dateString);
    return {
      timeOnly: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      full: date.toLocaleString(),
    };
  };

  return (
    <>
      {/* Slide-in panel (controlled) */}
      <aside
        className={`activity-feed-panel ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
        aria-label="Comments sidebar"
      >
        <div className="activity-feed-header">
          <h4>Comments {commentCount ? `(${commentCount})` : ''}</h4>
          {/* Close uses existing onClose handler from parent (no extra buttons added elsewhere) */}
          <button
            type="button"
            className="close-panel-btn"
            onClick={onClose}
            aria-label="Close comments panel"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Body is a flex column; list scrolls, composer is sticky at bottom */}
        <div className="activity-feed-body">
          <div className="comment-list">
            {loadingComments ? (
              <p className="loading">Loading comments...</p>
            ) : comments.length ? (
              comments.map((comment) => {
                const { timeOnly, full } = formatCommentTime(comment.createdAt);
                const initials = (comment.userName || '??')
                  .toString()
                  .trim()
                  .split(/\s+/)
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase();

                return (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar" aria-hidden="true">{initials || '??'}</div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-author">{comment.userName}</span>
                        <span className="comment-time" title={full}>{timeOnly}</span>
                      </div>
                      <p className="comment-text">{comment.comment}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-state">No comments yet. Be the first to add one!</p>
            )}
          </div>

          {/* Existing post button — restyled, not duplicated */}
          <div className="composer">
            <div className="comment-input-area">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add comment"
              />
              <button onClick={handlePostComment} className="post-comment-btn" title="Post comment">
                Send
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop to close panel (still uses onClose you already provide) */}
      {isOpen && <button className="activity-feed-backdrop" aria-label="Close comments" onClick={onClose} />}
    </>
  );
};

export default ActivityFeed;
