
export const environment = {
    production: false,
    envName: 'dev',
    sentryDsn: 'https://bfc8361efe651450288425dfc0562f38@o70039.ingest.us.sentry.io/4511495403667456',
    algoliaCandidateIndex: 'dev_candidate_public',
    algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
    apiEndpoint: 'http://localhost:23080/v1',
    permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/",
    cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596525812/dev/',
    environmentName: 'Dev Server',
    serviceWorker: true,
    mixpanelKey: 'ac62dbe81767f8871f754c7bdf6669d6',
};
