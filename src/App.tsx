import { type FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNucleus } from '@forgedevstack/synapse';
import { Navbar } from '@components/Navbar';
import { Footer } from '@components/Footer';
import { ChatWidget } from '@components/ChatWidget';
import { Home } from '@pages/Home';
import { Privacy } from '@pages/Privacy';
import { Terms } from '@pages/Terms';
import { Docs } from '@pages/Docs';
import { Changelog } from '@pages/Changelog';
import {
  ROUTE_HOME,
  ROUTE_PRIVACY,
  ROUTE_TERMS,
  ROUTE_DOCS,
  ROUTE_CHANGELOG,
} from '@constants/routes.const';
import { chatNucleus } from '@store/modules/Chat';

export const App: FC = () => {
  const { openChat } = useNucleus(chatNucleus);

  const handleOpenChat = () => {
    openChat();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar onOpenChat={handleOpenChat} />
        <main>
          <Routes>
            <Route path={ROUTE_HOME} element={<Home onOpenChat={handleOpenChat} />} />
            <Route path={ROUTE_PRIVACY} element={<Privacy />} />
            <Route path={ROUTE_TERMS} element={<Terms />} />
            <Route path={ROUTE_DOCS} element={<Docs />} />
            <Route path={ROUTE_CHANGELOG} element={<Changelog />} />
            <Route path="*" element={<Navigate to={ROUTE_HOME} replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
};
