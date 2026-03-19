import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { FaSearch, FaPlus, FaHeart, FaRegHeart, FaComment, FaEye, FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { forumService } from '../services/forumService';
import { authService } from '../services/authService';
import './ForumPage.css';

const ForumPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');

    // Create Post State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const [creating, setCreating] = useState(false);

    // Detail View State
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const isLoggedIn = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    useEffect(() => {
        fetchPosts();
    }, [searchParams]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                sort: 'newest'
            };
            const data = await forumService.getPosts(params);
            if (data.success) {
                setPosts(data.data.posts);
            }
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            fetchPosts();
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            message.error('Please enter title and content');
            return;
        }

        setCreating(true);
        try {
            const data = await forumService.createPost({
                title: newPostTitle,
                content: newPostContent
            });

            if (data.success) {
                message.success('Post created successfully!');
                setShowCreateModal(false);
                setNewPostTitle('');
                setNewPostContent('');
                fetchPosts();
            }
        } catch (error) {
            message.error(error.message || 'Failed to create post');
        } finally {
            setCreating(false);
        }
    };

    const handleViewPost = async (post) => {
        setSelectedPostId(post.id);
        setLoading(true);
        try {
            const data = await forumService.getPostById(post.id);
            if (data.success) {
                setSelectedPost(data.data.post);
                setComments(data.data.comments);
            }
        } catch (error) {
            message.error('Failed to load post details');
            setSelectedPostId(null);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedPostId(null);
        setSelectedPost(null);
        setComments([]);
    };

    const handleAddComment = async () => {
        if (!isLoggedIn) {
            message.warning('Please login to comment');
            return;
        }
        if (!newComment.trim()) return;

        try {
            const data = await forumService.addComment(selectedPostId, newComment);
            if (data.success) {
                setComments([...comments, data.data]);
                setNewComment('');
                message.success('Comment added');
            }
        } catch (error) {
            message.error('Failed to add comment');
        }
    };

    const handleLikePost = async (e, postId) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            message.warning('Please login to like posts');
            return;
        }

        try {
            const data = await forumService.toggleLikePost(postId);
            if (data.success) {
                // Update local state for list view
                setPosts(posts.map(p =>
                    p.id === postId
                        ? { ...p, likeCount: data.data.likes, isLiked: data.data.isLiked }
                        : p
                ));

                // Update detail view if active
                if (selectedPost && selectedPost.id === postId) {
                    setSelectedPost({
                        ...selectedPost,
                        likeCount: data.data.likes,
                        likes: data.data.isLiked
                            ? [...(selectedPost.likes || []), currentUser.id]
                            : (selectedPost.likes || []).filter(id => id !== currentUser.id)
                    });
                }
            }
        } catch (error) {
            console.error('Like failed', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (selectedPostId && selectedPost) {
        // DETAIL VIEW
        const isLiked = selectedPost.likes && selectedPost.likes.includes(currentUser?.id);

        return (
            <div className="forum-page">
                <div className="forum-container">
                    <div className="post-detail-view">
                        <div className="detail-header">
                            <button className="back-btn" onClick={handleBackToList}>
                                <FaArrowLeft /> Back to Forum
                            </button>
                            <h1 className="detail-title">{selectedPost.title}</h1>
                            <div className="post-author">
                                <img
                                    src={selectedPost.user?.avatarUrl || '/img/default-avatar.png'}
                                    alt="Avatar"
                                    className="author-avatar"
                                />
                                <div className="author-info">
                                    <h4>{selectedPost.user?.fullName || 'Anonymous'}</h4>
                                    <span className="post-date">{formatDate(selectedPost.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-content">
                            {selectedPost.content}
                        </div>

                        <div className="detail-actions">
                            <button
                                className={`action-btn ${isLiked ? 'liked' : ''}`}
                                onClick={(e) => handleLikePost(e, selectedPost.id)}
                            >
                                {isLiked ? <FaHeart /> : <FaRegHeart />}
                                {selectedPost.likeCount} Likes
                            </button>
                            <button className="action-btn">
                                <FaEye /> {selectedPost.views} Views
                            </button>
                        </div>

                        <div className="comments-section">
                            <h3>Comments ({comments.length})</h3>

                            <div className="comment-form">
                                <div className="comment-input-wrapper">
                                    <textarea
                                        className="comment-input"
                                        placeholder={isLoggedIn ? "Write a comment..." : "Please login to comment"}
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        disabled={!isLoggedIn}
                                    ></textarea>
                                </div>
                                <button
                                    className="send-comment-btn"
                                    onClick={handleAddComment}
                                    disabled={!isLoggedIn || !newComment.trim()}
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>

                            <div className="comments-list">
                                {comments.map(comment => (
                                    <div key={comment.id} className="comment-item">
                                        <img
                                            src={comment.user?.avatarUrl || '/img/default-avatar.png'}
                                            alt="Avatar"
                                            className="author-avatar"
                                            style={{ width: '32px', height: '32px' }}
                                        />
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.user?.fullName}</span>
                                                <span className="comment-time">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <div className="comment-text">{comment.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIST VIEW
    return (
        <div className="forum-page">
            <div className="forum-header">
                <h1 className="forum-title">Community Forum</h1>
                <p className="forum-subtitle">Discuss books, share reviews, and connect with other readers</p>
            </div>

            <div className="forum-container">
                <div className="forum-controls">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search discussions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    {isLoggedIn ? (
                        <button className="new-post-btn" onClick={() => setShowCreateModal(true)}>
                            <FaPlus /> Create New Post
                        </button>
                    ) : (
                        <button className="new-post-btn" onClick={() => message.info("Login to create posts")}>
                            Login to Post
                        </button>
                    )}
                </div>

                <div className="posts-list">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                    ) : posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No conversations yet. Start one!</div>
                    ) : (
                        posts.map(post => {
                            const isLiked = post.likes && post.likes.includes(currentUser?.id);
                            return (
                                <div key={post.id} className="post-card" onClick={() => handleViewPost(post)}>
                                    <div className="post-header">
                                        <div className="post-author">
                                            <img
                                                src={post.user?.avatarUrl || '/img/default-avatar.png'}
                                                alt="Avatar"
                                                className="author-avatar"
                                            />
                                            <div className="author-info">
                                                <h4>{post.user?.fullName || 'Anonymous'}</h4>
                                                <span className="post-date">{formatDate(post.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="post-title">{post.title}</h3>
                                    <p className="post-excerpt">{post.content}</p>
                                    <div className="post-footer">
                                        <div className={`footer-item ${isLiked ? 'liked' : ''}`}>
                                            {isLiked ? <FaHeart /> : <FaRegHeart />} {post.likeCount}
                                        </div>
                                        <div className="footer-item">
                                            <FaComment /> {post.commentCount}
                                        </div>
                                        <div className="footer-item">
                                            <FaEye /> {post.views}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Discussion</h3>
                            <button className="close-modal" onClick={() => setShowCreateModal(false)}>&times;</button>
                        </div>
                        <form className="modal-form" onSubmit={handleCreatePost}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="What is this discussion about?"
                                    value={newPostTitle}
                                    onChange={e => setNewPostTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Content</label>
                                <textarea
                                    className="form-textarea"
                                    rows="6"
                                    placeholder="Write your thoughts..."
                                    value={newPostContent}
                                    onChange={e => setNewPostContent(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="submit-btn" disabled={creating}>
                                {creating ? 'Posting...' : 'Post Discussion'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForumPage;
