export const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const secondPast = (now.getTime() - date.getTime()) / 1000;

    if (secondPast < 60) {
        return `${Math.floor(secondPast)}s ago`;           // секунды
    }
    if (secondPast < 3600) {
        return `${Math.floor(secondPast / 60)}m ago`;      // минуты
    }
    if (secondPast < 86400) {
        return `${Math.floor(secondPast / 3600)}h ago`;    // часы
    }

    const day = Math.floor(secondPast / 86400);
    if (day < 30) {
        return day === 1 ? `${day} day ago` : `${day} days ago`;  // дни
    }
};