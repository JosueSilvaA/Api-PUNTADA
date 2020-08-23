const webpush = require("web-push");
const PUBLIC_VAPID_KEY = 'BPpK_LkVR3q0qC1DcRlItVowAdR9Fdl_0T_FTbfNYUMuts5JfZ5oVxw1_Zn1lBEK9cxu1v3iolhTdH6WdPAQtv0';
const PRIVATE_VAPID_KEY = 'tXg660IaaEnssH1IYDnAyDOuwvNQjZlFAWP3OgJ85Tc';

webpush.setVapidDetails(
  "mailto:user@lapuntada.com",
  PUBLIC_VAPID_KEY,
  PRIVATE_VAPID_KEY
);

module.exports = webpush;
