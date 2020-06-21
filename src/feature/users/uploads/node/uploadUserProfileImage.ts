import { uploadImageToFirebaseStorage } from 'base/node/storage';

export const uploadUserProfileImage = async (id: string, image: string) => {
	if (!image || !id) return '';
	const filename = `images/users/profile/${id}`;
	const imageURL = await uploadImageToFirebaseStorage(image, filename);
	return imageURL;
};
