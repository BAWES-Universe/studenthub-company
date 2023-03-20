export const environment = {
    production: true,
    envName: 'saoud',
    apiEndpoint: 'http://localhost/~Saoud/pogi/pogi/admin/web/v1',
    algoliaCandidateIndex: 'saoud_candidate_public',
    algoliaCacheDuration: 5 * 60 * 1000, // 5 min in millisecond
    permanentBucketUrl: "https://studenthub-uploads-dev-server.s3.amazonaws.com/",
    cloudinaryUrl: 'https://res.cloudinary.com/studenthub/image/upload/c_thumb,w_200,h_200,g_face,q_auto:low/v1596525812/dev/',
    environmentName: 'Saoud Local Machine',
    s3Domain: 'studenthub-uploads-dev-server',
    serviceWorker: false,
    mixpanelKey: 'ac62dbe81767f8871f754c7bdf6669d6',
}
