// In production, replace this with { uri: post.photoUrl } from the database.
// ImageSourcePropType accepts both require() numbers and { uri: string } objects.
const MOCK_POST_IMAGES: Record<string, any> = {
  '1':  require('@/assets/images/mockimages/1.png'),
  '2':  require('@/assets/images/mockimages/2.png'),
  '3':  require('@/assets/images/mockimages/3.png'),
  pan:  require('@/assets/images/mockimages/pan.png'),
};

export default MOCK_POST_IMAGES;
