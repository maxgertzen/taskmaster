import { FC } from 'react';

import { HighlightedArea, SpriteIcon, Title } from '@/features/ui/components';

import { ListsActionsContainer, TitleContainer } from './ListsActions.styled';

interface ListsActionsProps {
  addList: () => void;
}

export const ListsActions: FC<ListsActionsProps> = ({ addList }) => {
  return (
    <ListsActionsContainer>
      <TitleContainer>
        <SpriteIcon name='list' />
        <Title variant='h6'>Lists</Title>
      </TitleContainer>
      <HighlightedArea id='add-list'>
        <SpriteIcon name='plus' onClick={addList} />
      </HighlightedArea>
    </ListsActionsContainer>
  );
};
