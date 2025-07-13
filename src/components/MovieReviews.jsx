import React, { useState } from 'react';

const MovieReviews = ({ reviews }) => {
  const [expandedReviews, setExpandedReviews] = useState(new Set());

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 300) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const toggleReview = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    
    if (avatarPath.startsWith('/https')) {
      return avatarPath.substring(1);
    }
    return `https://image.tmdb.org/t/p/w45${avatarPath}`;
  };

  return (
    <section className="reviews-section">
      <h2>Reseñas de usuarios</h2>
      
      {reviews.length === 0 ? (
        <p className="no-reviews">No hay reseñas disponibles para esta película.</p>
      ) : (
        <div className="reviews-container">
          {reviews.map((review) => {
            const isExpanded = expandedReviews.has(review.id);
            const shouldTruncate = review.content.length > 300;
            
            return (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="author-info">
                    <div className="author-avatar">
                      {review.author_details.avatar_path ? (
                        <img 
                          src={getAvatarUrl(review.author_details.avatar_path)}
                          alt={review.author}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="author-details">
                      <h3>{review.author}</h3>
                      <p className="review-date">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  {review.author_details.rating && (
                    <div className="rating">
                      <span className="star">★</span>
                      <span>{review.author_details.rating}/10</span>
                    </div>
                  )}
                </div>
                
                <div className="review-content">
                  <p>
                    {isExpanded || !shouldTruncate 
                      ? review.content 
                      : truncateText(review.content)
                    }
                  </p>
                  {shouldTruncate && (
                    <button 
                      className="expand-btn"
                      onClick={() => toggleReview(review.id)}
                    >
                      {isExpanded ? 'Leer menos' : 'Leer más'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <style jsx>{`
        .reviews-section {
          margin-top: 2rem;
        }

        .reviews-section h2 {
          color: #1f2937;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }

        .no-reviews {
          color: #6b7280;
          font-style: italic;
          text-align: center;
          padding: 2rem;
        }

        .reviews-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-card {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          background: #3b82f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .author-details h3 {
          color: #1f2937;
          margin: 0;
          font-size: 1rem;
        }

        .review-date {
          color: #6b7280;
          font-size: 0.85rem;
          margin: 0.25rem 0 0 0;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #f5c518;
          font-weight: bold;
        }

        .star {
          font-size: 1.2rem;
        }

        .review-content {
          color: #374151;
          line-height: 1.6;
        }

        .review-content p {
          margin: 0;
        }

        .expand-btn {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          font-size: 0.9rem;
          margin-top: 0.5rem;
          text-decoration: underline;
          padding: 0;
        }

        .expand-btn:hover {
          color: #2563eb;
        }

        @media (max-width: 768px) {
          .review-header {
            flex-direction: column;
            gap: 1rem;
          }

          .rating {
            align-self: flex-start;
          }
        }
      `}</style>
    </section>
  );
};

export default MovieReviews;