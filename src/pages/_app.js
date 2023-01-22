import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components';
import '@/styles/globals.css';
import { StateContext } from '@/context/StateContext';

export default function App({ Component, pageProps }) {
	return (
		<StateContext>
			<Layout>
				<Toaster position="top-right" reverseOrder={false} />
				<Component {...pageProps} />
			</Layout>
		</StateContext>
	);
}
