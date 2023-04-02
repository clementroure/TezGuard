import { connectWallet, disconnectWallet } from '@/utils/wallet'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from "next/image";
import { useState } from 'react';

const links = [
	{ label: 'Page2', href: '/page2' },
	{ label: 'Page3', href: '/page3' },
]

const Appbar = () => {
	const router = useRouter()

	type CurrentPage = 'team' | 'projects';
    const [currentPage, setCurrentPage] = useState<CurrentPage>('team');

	type UserType = 'company' | 'user';
	const [userType, setUserType] = useState<UserType>('company');

	const [isNavbarVisible, setIsNavbarVisible] = useState(false)
	const [currentWallet, setCurrentWallet] = useState()

	if (typeof window != "undefined") {
		window.addEventListener('login',  function( detail: any) {

			setCurrentWallet(detail.detail.address)
			setUserType(detail.detail.userType)

			setIsNavbarVisible(true)
		});
	}

	const _disconnectWallet = async () => {
  
		await disconnectWallet();

		if (typeof window != "undefined")
		window.dispatchEvent(new CustomEvent('logout'));

		setCurrentWallet(undefined)
		setIsNavbarVisible(false)
	};

	const switchTab = (index:number) => {
       if(index == 0){
        
		  setCurrentPage('team')
		  window.dispatchEvent(new CustomEvent('switchTab',  {detail: 'team'}));
	   }
	   if(index == 1){

		  setCurrentPage('projects')
		  window.dispatchEvent(new CustomEvent('switchTab',  {detail: 'projects'}));
	   }
	}

	return (
		<>
		{isNavbarVisible &&
		<div className='fixed top-0 left-0 z-20 w-full bg-zinc-900 pt-safe block rounded-b-3xl shadow border-b border-black'>
			<header className='border-b bg-zinc-100 px-safe dark:border-zinc-800 dark:bg-zinc-900 rounded-b-3xl'>
				<div className='mx-auto flex h-14 sm:h-16 max-w-screen-lg items-center justify-between px-0'>
				<Link href="/" className="flex items-center space-x-3">
					<Image
						src="/logo.svg"
						alt="Precedent logo"
						width="25"
						height="25"
						draggable={false}
						/>
					<p className="bg-white bg-clip-text text-2xl font-medium tracking-tight text-transparent">
						TezGuard 
					</p>
				</Link>
					
				{userType == 'company' &&
				<div className='ml-24'>
					<ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
						<li className="w-full">
							{currentPage=='team' ?
							<button className="border border-zinc-400 transition ease-in-out inline-block w-full p-4 text-gray-900 bg-gray-100 rounded-l-lg active focus:outline-none dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-gray-700" aria-current="page">Team</button>
							:
							<button onClick={() => switchTab(0)}  className="inline-block transition ease-in-out w-full p-4 text-gray-900 bg-gray-100 rounded-l-lg active focus:outline-none dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-gray-700" aria-current="page">Team</button>
		                    }
						</li>
						<li className="w-full">
						{currentPage=='team' ?
							<button onClick={() => switchTab(1)}  className="inline-block transition ease-in-out w-full p-4 text-gray-900 bg-gray-100 rounded-r-lg active focus:outline-none dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-gray-700" aria-current="page">Projects</button>
							:
							<button className="border border-zinc-400 transition ease-in-out inline-block w-full p-4 text-gray-900 bg-gray-100 rounded-r-lg active focus:outline-none dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-gray-700" aria-current="page">Projects</button>
		                    }						
						</li>
					</ul>
				</div>
                }

					<nav className='flex items-center space-x-6'>

						<div className='hidden sm:block'>
							<div className='flex items-center space-x-6'>
								{/* {links.map(({ label, href }) => (
									<Link key={label} href={href}
									className={`text-sm ${
										router.pathname === href
											? 'text-indigo-500 dark:text-indigo-400'
											: 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
								     	}`}
									>
										{label}
									</Link>
								))} */}
							</div>
						</div>

						<p onClick={() => {navigator.clipboard.writeText(currentWallet!)}} className='text-zinc-300 text-sm sm:text m-auto w-28 truncate font-semibold cursor-pointer hover:text-zinc-200 hover:scale-[1.02]'>
							{currentWallet}
						</p>

						<button onClick={_disconnectWallet} className="mt-2 text-white bg-gradient-to-br from-gray-700 to-gray-800 font-medium rounded-lg text-sm px-5 py-1.5 mr-2 mb-2 text-center inline-flex items-center shadow-md shadow-gray-300 dark:shadow-gray-900 hover:scale-[1.02] transition-transform">
							Logout
						</button>
					</nav>
				</div>
			</header>
		</div>
		}
		</>
	)
}

export default Appbar
