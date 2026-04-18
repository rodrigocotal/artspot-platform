/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { HeroImage } from '../hero-image';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src} alt={props.alt} />;
  },
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe('<HeroImage />', () => {
  it('renders nothing when image is null', () => {
    const { container } = render(<HeroImage image={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when image.visible is false', () => {
    const { container } = render(
      <HeroImage image={{ url: 'https://cdn/x.jpg', alt: 'X', visible: false }} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when url is missing', () => {
    const { container } = render(<HeroImage image={{ url: '', alt: 'X', visible: true }} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders image with alt text when visible', () => {
    render(
      <HeroImage image={{ url: 'https://cdn/x.jpg', alt: 'Gallery view', visible: true }} />,
    );
    expect(screen.getByAltText('Gallery view')).toBeInTheDocument();
  });

  it('renders caption when provided', () => {
    render(
      <HeroImage
        image={{ url: 'https://cdn/x.jpg', alt: 'X', caption: 'Spring 2026', visible: true }}
      />,
    );
    expect(screen.getByText('Spring 2026')).toBeInTheDocument();
  });

  it('wraps image in a link when linkUrl provided', () => {
    render(
      <HeroImage
        image={{
          url: 'https://cdn/x.jpg',
          alt: 'X',
          linkUrl: '/collections/spring',
          visible: true,
        }}
      />,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/collections/spring');
    expect(link).toContainElement(screen.getByAltText('X'));
  });

  it('does not wrap in link when linkUrl missing', () => {
    render(<HeroImage image={{ url: 'https://cdn/x.jpg', alt: 'X', visible: true }} />);
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('defaults visible=true when property omitted', () => {
    render(<HeroImage image={{ url: 'https://cdn/x.jpg', alt: 'X' }} />);
    expect(screen.getByAltText('X')).toBeInTheDocument();
  });
});
