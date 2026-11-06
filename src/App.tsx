import { useState, useEffect, type FC } from 'react';
import { useNucleus } from '@forgedevstack/synapse';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { ChatWidget } from '@components/ChatWidget';
import { Home } from '@pages/Home';
import { Privacy } from '@pages/Privacy';
import { Terms } from '@pages/Terms';
import { ROUTE_PRIVACY, ROUTE_TERMS } from '@constants/routes.const';
import { chatNucleus } from '@store/modules/chat.reducers';

export const App: FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { openChat } = useNucleus(chatNucleus);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenChat = () => {
    openChat();
  };

  const renderPage = () => {
    switch (currentPath) {
      case ROUTE_PRIVACY:
        return <Privacy />;
      case ROUTE_TERMS:
        return <Terms />;
      default:
        return <Home onOpenChat={handleOpenChat} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar onOpenChat={handleOpenChat} />
        <main>{renderPage()}</main>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
};
