export default function SvgMock(iconName: string = 'test') {
  return function () {
    return <svg data-testid={`${iconName}-icon`} />;
  };
}
