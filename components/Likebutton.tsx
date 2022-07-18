import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';

import { MdFavorite } from 'react-icons/md';

import useAuthStore from '../store/authStore';

interface IProps {
	likes: any[];
	flex: string;
	handleLike: () => void;
	handleDislike: () => void;
}

const Likebutton: NextPage<IProps> = ({
	handleLike,
	handleDislike,
	likes,
	flex,
}: IProps) => {
	const [alreadyLiked, setAlreadyLiked] = useState(true);
	const { userProfile }: any = useAuthStore();

	let filterLikes = likes?.filter(
		(item: any) => item._ref === userProfile?._id
	);

	useEffect(() => {
		if (filterLikes?.length > 0) {
			setAlreadyLiked(true);
		} else {
			setAlreadyLiked(false);
		}
	}, [filterLikes, likes]);

	// console.log(alreadyLiked);
	// console.log(likes.length);

	return (
		<div className={`${flex} gap-6`}>
			<div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
				{alreadyLiked ? (
					<div
						className="bg-primary rounded-full p-2 md:p-4 text-[#F51997] "
						onClick={handleDislike}
					>
						<MdFavorite className="text-lg md:text-2xl" />
					</div>
				) : (
					<div
						className="bg-primary rounded-full p-2 md:p-4 "
						onClick={handleLike}
					>
						<MdFavorite className="text-lg md:text-2xl" />
					</div>
				)}
				<p className="text-md font-semibold ">{likes?.length || 0}</p>
			</div>
		</div>
	);
};

export default Likebutton;
