import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faTwitch, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(faYoutube, faTwitch, faInstagram);

const iconMap = {
  youtube: faYoutube,
  twitch: faTwitch,
  instagram: faInstagram,
};

const urlMap = {
  youtube: (username) => `https://www.youtube.com/@${username}`,
  twitch: (username) => `https://twitch.tv/${username}`,
  instagram: (username) => `https://www.instagram.com/${username}`,
};

/**
 * SocialMediaHandles component to display social media icons.
 * @param {Object} props - Component props.
 * @param {Object} props.data - Social media data.
 */
const SocialMediaHandles = ({ data }) => {
  return (
    <div>
      {Object.keys(data).map((key) => {
        const icon = iconMap[key.toLowerCase()];
        const url = urlMap[key.toLowerCase()](data[key]);
        if (icon) {
          return (
            <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ margin: '4px 0' }}>
              <FontAwesomeIcon icon={icon} style={{ marginRight: '8px' }} />
            </a>
          );
        }
        return null;
      })}
    </div>
  );
};

export default SocialMediaHandles;
