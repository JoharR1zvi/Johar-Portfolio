import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PagePlaceholder } from '@/components/layout/page-placeholder';

describe('PagePlaceholder', () => {
  it('renders the title and description', () => {
    render(<PagePlaceholder title="AI Lab" description="Interactive demonstrations." />);

    expect(screen.getByRole('heading', { name: 'AI Lab' })).toBeInTheDocument();
    expect(screen.getByText('Interactive demonstrations.')).toBeInTheDocument();
  });

  it('renders an optional badge', () => {
    render(<PagePlaceholder title="Notes" description="Short write-ups." badge="Coming soon" />);

    expect(screen.getByText('Coming soon')).toBeInTheDocument();
  });

  it('omits the badge when none is provided', () => {
    render(<PagePlaceholder title="Notes" description="Short write-ups." />);

    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
  });
});
