import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './pagination.js';

/**
 * Stories for `Pagination`.
 * Contract: docs/components/pagination.md
 */

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          'Boundary controls disable themselves from `page` and `pageCount` — that is ' +
          'arithmetic, not a prop. Disabled boundary controls stay announced rather than ' +
          'being removed from the DOM.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `Pagination`, both structures. Disabled boundary controls stay announced. */
export const Paginations: Story = {
  args: { page: 1, pageCount: 5, onPageChange: () => {} },
  render: () => <PaginationDemo />,
};

function PaginationDemo() {
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col gap-4">
      <Pagination page={page} pageCount={5} onPageChange={setPage} />
      <Pagination page={page} pageCount={5} onPageChange={setPage} compact />
      <p className="text-body-sm text-muted-foreground">
        Page 1 disables Previous; page 5 disables Next. That is arithmetic, not a prop.
      </p>
    </div>
  );
}
