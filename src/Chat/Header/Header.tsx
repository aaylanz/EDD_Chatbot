import { FC, useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onClose: () => void;
}

export const Header: FC<HeaderProps> = ({ onClose }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleUnmute = () => {
    // TODO: Implement unmute functionality
    console.log('Unmute clicked');
    setShowMenu(false);
  };

  const handleEndChat = () => {
    // TODO: Implement end chat functionality
    console.log('End chat clicked');
    setShowMenu(false);
    onClose();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <div className="chat-header">
        <div className="header-left">
          <button className="menu-dots" onClick={toggleMenu}>
            ⋮
          </button>
          <img src={`${import.meta.env.BASE_URL}images/edd-white.svg`} alt="EDD" className="header-logo" />
        </div>
        <div className="header-right">
          <button className="lang-selector">
            <span className="globe-icon">🌐</span>
            <span>English</span>
          </button>
          <button className="close-chat" onClick={onClose}>
            ×
          </button>
        </div>
      </div>
      {showMenu && (
        <div className="menu-dropdown" ref={menuRef}>
          <button className="menu-option" onClick={handleUnmute}>
            Unmute
          </button>
          <button className="menu-option" onClick={handleEndChat}>
            End Chat
          </button>
        </div>
      )}
    </>
  );
};
