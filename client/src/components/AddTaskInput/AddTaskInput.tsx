import { useState } from 'react';

import { AddTaskInputContainer, Input } from './AddTaskInput.styled';

interface AddTaskInputProps {
  onAddTask: (task: string) => void;
}

// TODO:
// - Replace button with an icon
export const AddTaskInput: React.FC<AddTaskInputProps> = ({ onAddTask }) => {
  const [task, setTask] = useState<string>('');

  const handleAddTask = () => {
    if (task) {
      onAddTask(task);
      setTask('');
    }
  };

  const handleKeyDown = ({ key }: React.KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Enter' && task) {
      handleAddTask();
    }
  };

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTask(value);
  };

  return (
    <AddTaskInputContainer>
      <Input
        type='text'
        value={task}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder='Add a task'
      />
      <button onClick={handleAddTask}>Add Task</button>
    </AddTaskInputContainer>
  );
};
