import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const createOrGetUser = async (response: any) => {
	const decoded = response.credential;

	console.log(decoded);
};
