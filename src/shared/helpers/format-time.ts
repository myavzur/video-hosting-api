import { getZero } from "./get-zero";

export const formatTime = (date: Date) => {
	const hour = getZero(date.getHours());
	const minutes = getZero(date.getMinutes());

	return `${hour}:${minutes}`;
};
