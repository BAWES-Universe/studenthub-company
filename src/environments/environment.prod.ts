export const environment = {
  production: true,
  envName: 'prod',
  sentryDsn: 'https://bfc8361efe651450288425dfc0562f38@o70039.ingest.us.sentry.io/4511495403667456',
  apiEndpoint: 'https://employer.api.studenthub.co/v1',
  algoliaCandidateIndex: 'prod_candidate_public',
  algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
  permanentBucketUrl: "https://studenthub-uploads.s3.amazonaws.com/",
  cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto/v1596525812/',
  environmentName: 'Production Server',
  serviceWorker: false,
  mixpanelKey: '14dd0e7bd65ea16179bb7b8424a6297c',
};
