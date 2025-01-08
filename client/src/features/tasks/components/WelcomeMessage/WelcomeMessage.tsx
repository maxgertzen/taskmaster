import { ClickableWord, Title } from '@/features/ui/components';

import { MobileTransitionWrapper } from './WelcomeMessage.styled';

interface WelcomeMessageProps {
  name?: string;
  isMobile: boolean;
}

export const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  name,
  isMobile,
}) => {
  return !isMobile ? (
    <>
      <Title variant='h4'>
        Hi {name ?? ''}! Ready to get on top of your to-do’s?
      </Title>
      <p>
        <br /> To get started,{' '}
        <b>
          add a list via the{' '}
          <ClickableWord target='add-list'>plus icon</ClickableWord> next to
          'lists'.
        </b>
      </p>
      <p>
        Whether it's your weekly shopping, Sunday cleaning itinerary, or the
        next steps of your latest project, you'll never miss out again.
      </p>
      <p>Select a list to view tasks or search for a task in the search bar</p>
    </>
  ) : (
    <MobileTransitionWrapper />
  );
};
