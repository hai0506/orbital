import { render, screen } from '@testing-library/react';
import LeftReview from '@/components/LeftReview';
import { describe, it, expect } from 'vitest';
import "@testing-library/jest-dom/vitest"

describe('left review', () => {
  const mockReview = {
    review_id: 3,
    vendor_fundraiser: 1,
    reviewer: { username: 'vendor1' },
    reviewee: { username: 'organization' },
    time_created: '2025-07-25T06:34:44.524061Z',
    rating: 4,
    comment: 'No comments.',
  };

  it('renders the rating and comment correctly', () => {
    render(<LeftReview review={mockReview} />);

    const filledStars = screen.getAllByTestId('filled-star');
    expect(filledStars).toHaveLength(4);

    const unfilledStars = screen.getAllByTestId('unfilled-star');
    expect(unfilledStars).toHaveLength(1);

    expect(screen.getByText('No comments.')).toBeInTheDocument();
  });

  it('shows fallback text when review is null', () => {
    render(<LeftReview review={null} />);

    expect(
      screen.getByText(/is yet to leave you a review/i)
    ).toBeInTheDocument();
  });
});
