import Head from 'next/head'
import Appbar from '@/components/appbar'
import BottomNav from '@/components/bottom-nav'
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

interface Props {
	title?: string
	children: React.ReactNode
}

let isBackgroundImageVisible = true

if (typeof window != "undefined") {
	window.addEventListener('logout', () => {
		isBackgroundImageVisible = true;
	});
	window.addEventListener('login', () => {
		isBackgroundImageVisible = false;
	});
}

const Page = ({ children }: Props) => (
	<>
		<Head>
			<title>TezGuard</title>
		</Head>

		<Appbar />

        {isBackgroundImageVisible &&
		<>
		<div className="relative">
		   <MobileView>
				<div className="bg-[url('/bck.webp')] bg-hero bg-no-repeat bg-cover bg-center bg-fixed absolute w-screen h-screen object-cover object-right -z-10"/>
		   </MobileView>
		   <BrowserView>
		       {/* <div className="bg-[url('/bck3.webp')] bg-hero bg-no-repeat bg-cover bg-center bg-fixed absolute w-screen h-screen object-cover object-right -z-20"/> */}
			   <video  
				className="bg-hero bg-no-repeat bg-cover bg-center bg-fixed absolute w-screen h-screen object-cover object-right -z-10"
				src='/video.mp4'
				controls={false}
				loop
				autoPlay 
				muted
				/>
		   </BrowserView>
		   <div className="absolute bg-gradient-to-b from-transparent via-transparent to-black h-screen w-full -z-10 opacity-70 blur-2xl rounded-3xl" />
		</div>
		<div className="area bg-hero bg-no-repeat bg-cover bg-center bg-fixed absolute w-screen h-screen -z-10">
            <ul className="circles">
		    	<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
            </ul>
        </div >
		</>
		}

		<main className='mx-auto pt-4 sm:pt-20 px-safe'>
			{children}
		</main>

		{/* <BottomNav /> */}
	</>
)

export default Page
