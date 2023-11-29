import express from 'express';
import PaytmChecksum from 'paytmchecksum';

const router = express.Router();

const MKEY = "1Ihx&s#y1St!Dk0m";

router.post('/handle_payment', (req, res) => {
    // Your logic to handle payment response from Paytm

    // Sample logic to handle the payment response and verify checksum
    const form = req.params;
    res.send(req.body);
    let checksum = '';
    let response_dict = {};

    for (const key in form) {
        response_dict[key] = form[key];
        if (key === 'CHECKSUMHASH') {
            checksum = form[key];
        }
    }

    const verify = PaytmChecksum.verifySignature(JSON.stringify(response_dict), MKEY, checksum);

    // if (verify) {
    //     // Logic for handling successful payment
    //     if (response_dict['RESPCODE'] === '01') {
    //         console.log('Payment successful');
    //         // Handle the order status update or other actions for a successful payment
    //         res.redirect('/success'); // Redirect to a success page
    //     } else {
    //         console.log('Payment failed:', response_dict['RESPMSG']);
    //         // Handle the order status update or other actions for a failed payment
    //         res.redirect('/failed'); // Redirect to a failure page
    //     }
    // } else {
    //     console.log('Checksum verification failed');
    //     res.status(400).send('Checksum verification failed'); // Send an error response
    // }
});

export default router;
