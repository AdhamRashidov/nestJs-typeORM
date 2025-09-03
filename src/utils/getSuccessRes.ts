import { iSuccessRes } from "src/interfaces/successRes";

export const getSuccessRes = (
	data: object,
	statusCode: number = 200,
): iSuccessRes => {
	return {
		statusCode,
		message: 'success',
		data,
	};
};