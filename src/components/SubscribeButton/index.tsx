import styles from './styles.module.scss'
import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import {getStripeJs} from "../../services/stripe-js";


interface SubscribeButtonProps {
    priceId: string;
}

interface responseProps {
    data: {
        sessionId: string;
    }
}

export function SubscribeButton({ priceId } : SubscribeButtonProps){

    const [ session ] = useSession();

    async function handleSubscribe() {
        if(!session){
            signIn('github');
            return;
        }


        // criar checkout session

        try {
            const response : responseProps = await api.post('/subscribe');
            const { sessionId }  = response.data;

            const stripe = await getStripeJs();

            await stripe.redirectToCheckout( { sessionId } );
            
        } catch (e){
            alert(e.message);
        }

    }

    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    )
}