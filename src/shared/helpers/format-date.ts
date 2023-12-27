import { getZero } from "./get-zero";

export const formatDate = (date: Date) => {
	const year = getZero(date.getFullYear());
	const month = getZero(date.getMonth() + 1);
	const day = getZero(date.getDate());

	return `${day}.${month}.${year}`;
};
