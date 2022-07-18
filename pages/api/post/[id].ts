// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { uuid } from 'uuidv4';
import { client } from '../../../utils/client';
import { postDetailQuery } from '../../../utils/queries';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		const { id } = req.query;
		const query = postDetailQuery(id);

		const data = await client.fetch(query);

		res.status(200).json(data[0]);
	} else if (req.method === 'PUT') {
		const { comment, userID } = req.body;
		const { id }: any = req.query;

		const data = await client
			.patch(id)
			.setIfMissing({ comment: [] })
			.insert('after', 'comments[-1]', [
				{
					comment,
					_key: uuid(),
					postedBy: { _type: 'postedBy', _ref: userID },
				},
			])
			.commit();

		res.status(200).json(data);
	}
}
