import { FC, ReactNode } from 'react';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';

interface PageLayoutProps {
    children: ReactNode;
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);
