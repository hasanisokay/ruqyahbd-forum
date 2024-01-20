const makeUrlsClickable = (text, theme) => {
  
  const themes = {
    light: {
      color: 'blue',
      fontWeight: 400,
    },
    dark: {
      color: '#86c9e8',
      fontWeight: 400,
      
    },
  };

  const linkStyle = `color: ${themes[theme].color}; font-weight: ${themes[theme].fontWeight};`;

  // Regex patterns for different types of URLs
  // const urlRegex = /(?:https?:\/\/[^\s]+)|(www\.[^\s]+)|(facebook\.com[^\s]+|fb\.com[^\s]+)|(youtube\.com[^\s]+|youtu\.be[^\s]+)|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.com(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.org(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.net(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.io(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.gov(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.edu(?:\/[^\s]*)?(?:\b|$)))/gi;
  const urlRegex = /(?:https?:\/\/[^\s]+)|(www\.[^\s]+)|(https:\/\/play\.google\.com\/store\/apps\/details\?id=[^\s]+)|(facebook\.com[^\s]+|fb\.com[^\s]+)|(youtube\.com[^\s]+|youtu\.be[^\s]+)|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.com(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.org(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.net(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.io(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.gov(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.edu(?:\/[^\s]*)?(?:\b|$)))/gi;
  
  return text.replace(urlRegex, (url) => {
    let prefixedUrl = url;

    // Check if the URL starts with "http://" or "https://", if not, add "https://"
    if (!url.startsWith("http")) {
      prefixedUrl = `https://${url}`;
    }

    // Check for specific domains and apply styling
    if (
      url.includes("facebook.com") ||
      url.includes("fb.com") ||
      url.includes("youtube.com") ||
      url.endsWith('.com') ||
      url.endsWith('.org') ||
      url.endsWith('.net') ||
      url.endsWith('.io') ||
      url.endsWith('.gov') ||
      url.endsWith('.edu') ||
      url.includes("youtu.be") ||
      url.includes("google.com") 
    ) {
      return `<a href="${prefixedUrl}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">${url}</a>`;
    }

    // For other URLs
    return `<a href="${prefixedUrl}" target="_blank" rel="noopener noreferrer" style="${linkStyle}">${url}</a>`;
  });
};

export default makeUrlsClickable;
