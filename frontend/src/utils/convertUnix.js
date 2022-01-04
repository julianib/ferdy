// convert a time in unix (seconds) to "x ago" string
export default function timeAgo(unix) {
  let now = new Date();
  let date = new Date(unix * 1000);

  let seconds = Math.floor((now - date) / 1000);

  if (seconds < 1) return "just now";
  if (seconds < 2) return "1 second ago";
  if (seconds < 60) return `${seconds} seconds ago`;

  let minutes = Math.floor(seconds / 60);

  if (minutes < 2) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  let hours = Math.floor(minutes / 60);

  if (hours < 2) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  let days = Math.floor(hours / 24);

  if (days < 2) return "1 day ago";
  if (days < 7) return `${days} days ago`;

  let weeks = Math.floor(days / 7);

  if (weeks < 2) return "1 week ago";
  if (days < 30) return `${weeks} weeks ago`;

  let months = Math.floor(days / 30);

  if (months < 2) return "1 month ago";
  if (months < 12) return `${months} months ago`;

  let years = Math.floor(months / 12);

  if (years < 2) return "1 year ago";
  
  return `${years} years ago`;
}
