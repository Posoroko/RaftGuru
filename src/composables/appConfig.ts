export default {
    dbUrl: 'https://db.raftguru.posoroko.com',

    // c5t_guide_01
    vapidPublic: 'BIdAR4wnsPoS3I-t9BF4gch698R8JoyIK_CyNcT89q9aLrR4mE_A2V_R26k8_MPtzoJxomotDlBIMJYtzm6hxqc'
}




// c5t_guide_01

// VAPID keys are a pair of private-public keys.
// to generate:
// ```
// npx web-push generate-vapid-k
// ```
// Public key is needed in the client AND the server, it is defined in nitro.config.ts
// the private key is stored as an env variable