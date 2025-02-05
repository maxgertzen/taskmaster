import { describe, it, expect } from 'vitest';

import { TaskManager } from '@/features/tasks/managers/TaskManager';
import { Filters, Sort } from '@/shared/types/mutations';

import { render, screen, within } from '../utils';

import '../integration/setup';

describe('Task Management Integration', () => {
  const mockList = { id: 'list1', name: 'Work List' };

  // TODO: Add data-testid to TaskBoard input for adding tasks
  it('should create a new task', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    const input = screen.getByPlaceholderText(/add a task/i);
    await user.type(input, 'New test task');
    await user.keyboard('{Enter}');

    expect(screen.getByText('New test task')).toBeInTheDocument();
  });

  // TODO: Add data-testid to task items and their action buttons
  it('should edit an existing task', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    const taskElement = screen.getByText('Task 1');
    const editButton = within(taskElement.closest('li')!).getByLabelText(
      /edit/i
    );
    await user.click(editButton);

    const editInput = screen.getByDisplayValue('Task 1');
    await user.clear(editInput);
    await user.type(editInput, 'Updated task');
    await user.keyboard('{Enter}');

    expect(screen.getByText('Updated task')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  // TODO: Add data-testid to task checkbox
  it('should toggle task completion', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    const taskElement = screen.getByText('Task 1');
    const checkbox = within(taskElement.closest('li')!).getByRole('checkbox');

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  // TODO: Add data-testid to delete button and confirmation dialog if exists
  it('should delete a task', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    const taskElement = screen.getByText('Task 1');
    const deleteButton = within(taskElement.closest('li')!).getByLabelText(
      /delete/i
    );

    await user.click(deleteButton);
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  // TODO: Add data-testid to filter buttons
  it('should filter tasks', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    // Click active filter
    const filterButtons = screen.getByRole('group', { name: /filter tasks/i });
    await user.click(within(filterButtons).getByText(/active/i));

    // Check that completed tasks are hidden
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument(); // Task 2 is completed
    expect(screen.getByText('Task 1')).toBeInTheDocument(); // Task 1 is active

    // Click completed filter
    await user.click(within(filterButtons).getByText(/completed/i));

    // Check that active tasks are hidden
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  // TODO: Add data-testid to sort buttons
  it('should sort tasks', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    const sortButton = screen.getByLabelText(/sort a to z/i);
    await user.click(sortButton);

    const tasks = screen.getAllByRole('listitem');
    // Verify order based on your sorting implementation
    expect(tasks[0]).toHaveTextContent('Task 1');
    expect(tasks[1]).toHaveTextContent('Task 2');
    expect(tasks[2]).toHaveTextContent('Task 3');
  });

  // TODO: Add data-testid to bulk action buttons
  it('should handle bulk actions', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    // Complete all
    const completeAllButton = screen.getByRole('button', {
      name: /complete all/i,
    });
    await user.click(completeAllButton);

    // Verify all tasks are completed
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });

    // Clear completed
    const clearCompletedButton = screen.getByRole('button', {
      name: /clear completed/i,
    });
    await user.click(clearCompletedButton);

    // Verify all completed tasks are removed
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  // TODO: Add data-testid to drag handles and implement drag-drop test helper
  it('should reorder tasks via drag and drop', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    // TODO: Implement proper drag and drop simulation
    const tasks = screen.getAllByRole('listitem');
    const dragHandle = within(tasks[0]).getByLabelText(/drag/i);

    // Mock drag and drop
    // This will need to be implemented based on your drag-drop library
  });

  // TODO: Add data-testid to filter buttons
  it('should filter tasks', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    // Click active filter
    const filterButtons = screen.getByRole('group', { name: /filter tasks/i });
    await user.click(within(filterButtons).getByText(/active/i));

    // Verify correct filter was applied with proper type
    const activeFilter: Filters = 'active';
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument(); // Task 2 is completed
    expect(screen.getByText('Task 1')).toBeInTheDocument(); // Task 1 is active

    // Click completed filter
    await user.click(within(filterButtons).getByText(/completed/i));

    // Verify correct filter was applied with proper type
    const completedFilter: Filters = 'completed';
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  // TODO: Add data-testid to sort buttons
  it('should sort tasks', async () => {
    const { user } = render(<TaskManager list={mockList} />);

    // Test A-Z sort
    const ascSort: Sort = 'asc';
    const sortAZButton = screen.getByLabelText(/sort a to z/i);
    await user.click(sortAZButton);

    let tasks = screen.getAllByRole('listitem');
    expect(tasks[0]).toHaveTextContent('Task 1');
    expect(tasks[1]).toHaveTextContent('Task 2');
    expect(tasks[2]).toHaveTextContent('Task 3');

    // Test Z-A sort
    const descSort: Sort = 'desc';
    const sortZAButton = screen.getByLabelText(/sort z to a/i);
    await user.click(sortZAButton);

    tasks = screen.getAllByRole('listitem');
    expect(tasks[0]).toHaveTextContent('Task 3');
    expect(tasks[1]).toHaveTextContent('Task 2');
    expect(tasks[2]).toHaveTextContent('Task 1');
  });
});
