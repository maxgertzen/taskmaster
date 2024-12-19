import { DropResult } from '@hello-pangea/dnd';

interface DragAndDropOptions {
  onReorder: (oldIndex: number, newIndex: number) => void;
}

export const useDragAndDropHandler = ({ onReorder }: DragAndDropOptions) => {
  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.index !== destination.index) {
      onReorder(source.index, destination.index);
    }
  };

  return { handleOnDragEnd };
};
