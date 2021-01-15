export const environment = {
  production: true,
  envName: 'prod',
  apiEndpoint: 'https://employer.api.studenthub.co/v1',
  algoliaCandidateIndex: 'prod_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  permanentBucketUrl: "https://studenthub-uploads.s3.amazonaws.com/",
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto/v1596525812/',
  environmentName: 'Production Server',
  serviceWorker: false
};
