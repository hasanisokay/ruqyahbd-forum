const getFirstClickableLink = async (text) => {
  const urlRegex =
    /(?:https?:\/\/[^\s]+)|(www\.[^\s]+)|(facebook\.com[^\s]+|fb\.com[^\s]+)|(youtube\.com[^\s]+|youtu\.be[^\s]+)|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.com(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.org(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.net(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.io(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.gov(?:\/[^\s]*)?(?:\b|$)))|((\b(?:[a-z0-9-]+\.)*[a-z0-9-]+\.edu(?:\/[^\s]*)?(?:\b|$)))/gi;
  const match = text.match(urlRegex);
  if (!match) {
    return null;
  }
  const firstUrl = match[0];
  let prefixedUrl = firstUrl;
  if (!firstUrl.startsWith("http")) {
    prefixedUrl = `https://${firstUrl}`;
  }
  return prefixedUrl;
};

export default getFirstClickableLink;
