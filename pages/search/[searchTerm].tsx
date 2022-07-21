import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { GoVerified } from 'react-icons/go';

import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import { IUser, Video } from '../../types';
import { BASE_URL } from '../../utils';
import useAuthStore from '../../store/authStore';

const Search = ({ videos }: { videos: Video[] }) => {
	return <div>Search</div>;
};

export const getServerSideProps = async ({
	params: { searchTerm },
}: {
	params: { searchTerm: string };
}) => {
	const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);

	return {
		props: { videos: res.data },
	};
};

export default Search;
