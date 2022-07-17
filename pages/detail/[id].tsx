import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';

import useAuthStore from '../../store/authStore';
import Likebutton from '../../components/Likebutton';
import Comments from '../../components/Comments';

interface IProps {
	postDetails: Video;
}

const Detail = ({ postDetails }: IProps) => {
	const [post, setPost] = useState(postDetails);
	const [playing, setPlaying] = useState(false);
	const [isVideoMuted, setIsVideoMuted] = useState(false);

	const router = useRouter();
	const { userProfile }: any = useAuthStore();

	const videoRef = useRef<HTMLVideoElement>(null);

	const onVideoClick = () => {
		if (playing) {
			videoRef?.current?.pause();
			setPlaying(false);
		} else {
			videoRef?.current?.play();
			setPlaying(true);
		}
	};

	useEffect(() => {
		if (post && videoRef?.current) {
			videoRef.current.muted = isVideoMuted;
		}
	}, [post, isVideoMuted]);

	const handleLike = async (like: boolean) => {
		if (userProfile) {
			const { data } = await axios.put(`${BASE_URL}/api/like`, {
				userId: userProfile._id,
				postId: post._id,
				like,
			});

			setPost({ ...post, likes: data.likes });
		}
	};

	if (!post) return null;
	return (
		<div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
			<div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black ">
				<div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
					<p
						onClick={() => router.back()}
						className="cursor-pointer text-white text-[35px]"
					>
						<MdOutlineCancel />
					</p>
				</div>
				<div className="relative">
					<div className="lg:h-[100vh] h-[60vh]">
						<video
							ref={videoRef}
							loop
							onClick={onVideoClick}
							src={post.video.asset.url}
							className="h-full cursor-pointer "
						></video>
					</div>

					<div className="absolute top-[45%] left-[45%] cursor-pointer">
						{!playing && (
							<button onClick={onVideoClick}>
								<BsFillPlayFill className="text-white text-6xl lg:text-8xl" />
							</button>
						)}
					</div>
				</div>
				<div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
					{isVideoMuted ? (
						<button
							onClick={() => setIsVideoMuted(false)}
							className="text-white text-2xl lg:text-4xl"
						>
							<HiVolumeOff />
						</button>
					) : (
						<button
							onClick={() => setIsVideoMuted(true)}
							className="text-white text-2xl lg:text-4xl"
						>
							<HiVolumeUp />
						</button>
					)}
				</div>
			</div>

			<div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
				<div className="lg:mt-20 mt-10">
					<div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
						<div className="ml-4 md:w-20 md:h-20 w-16 h-16">
							<Link href="/">
								<>
									<Image
										width={62}
										height={62}
										className="rounded-full"
										src={post.postedBy.image}
										alt="profile photo"
										layout="responsive"
									/>
								</>
							</Link>
						</div>
						<div>
							<Link href="/">
								<div className="flex flex-col mt-3 gap-2">
									<p className="flex gap-2 items-center md:text-md font-bold text-primary">
										{post.postedBy.userName}{' '}
										{`
                                    `}
										<GoVerified className="text-blue-400 text-md" />
									</p>
									<p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
										{post.postedBy.userName}
									</p>
								</div>
							</Link>
						</div>
					</div>

					<p className="px-10 text-lg mt-2 text-gray-600">{post.caption}</p>
					<div className="mt-10 px-10">
						{userProfile && (
							<Likebutton
								likes={post.likes}
								handleLike={() => handleLike(true)}
								handleDislike={() => handleLike(false)}
							/>
						)}
					</div>
					<Comments />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps = async ({
	params: { id },
}: {
	params: { id: string };
}) => {
	const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

	return {
		props: {
			postDetails: data,
		},
	};
};

export default Detail;
