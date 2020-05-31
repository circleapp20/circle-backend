import { uploadImageToFirebaseStorage } from '../../_shared/services';
import { Constants } from './_helpers/constants';

export const uploadUserProfileImage = async (id: string, image: string) => {
	if (!image || !id) return '';
	const filename = `${Constants.users.PROFILE_IMAGE_PATH}/${id}`;
	const imageURL = await uploadImageToFirebaseStorage(image, filename);
	return imageURL;
};
