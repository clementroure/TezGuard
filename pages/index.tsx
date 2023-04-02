
// a cause de manque de temps, la quasi totalité du code se trouve dans ce fichier
// Regardez /utils/wallet.ts  pour le reste du code

import Page from '@/components/page'
import Section from '@/components/section'
import { connectWallet, disconnectWallet, getNFT, mintNFT } from '@/utils/wallet';
import { useEffect, useRef, useState, Fragment } from 'react';
import Image, { StaticImageData } from 'next/image';
import { AccountInfo } from '@airgap/beacon-wallet';
import { char2Bytes, verifySignature } from '@taquito/utils';
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';
import { motion, Reorder, useAnimation } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react'
import  secureLocalStorage  from  "react-secure-storage";

export default function Index() {

	const [menuOpacity, setMenuOpacity] = useState(0)

	const [users, setUsers] = useState<{wallet: string, name:string, email: string, picture: string, position: string}[]>([])
	const [projects, setProjects] = useState<{id: string, name: string, desc: string, image: string, date: Date}[]>([])

	const [organisationName, setOrganisationName] = useState('Liquid Labs')
	const [userSelected, setUserSelected] = useState<{wallet: string, name:string, email: string, picture: string, position: string}>()

	const [currentTab, setCurrentTab] = useState('team')

	const [loading, setLoading] = useState(false)
	const [currentWallet, setCurrentWallet] = useState<AccountInfo>()

	const [isActionListVisible, setIsActionListVisible] = useState(false)
	const [isTablePopupVisible, setIsTablePopupVisible] = useState(false)
	const [isAlertPopupVisible, setIsAlertPopupVisible] = useState(false)

	type UserType = 'company' | 'user';
	const [userType, setUserType] = useState<UserType>('company');

	// trigger input file selection
	const avatarInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRefClick = () => {
        avatarInputRef.current!.click();
     }

	 useEffect(() => {
		const timeout = setTimeout(() => {
			setMenuOpacity(1)
		  }, 100)
	  
		  return () => clearTimeout(timeout)
	 },[])

	// trigger Beacon to select a Tezos wallet
	const loginWallet = async () => {
  
		await disconnectWallet();
  
		const wallet = await connectWallet();
		const userAddress = await wallet.client.getActiveAccount()

		// here, we ask for a signature to cehck if the user is really the owner of the wallet and can sign a message with his private key
		const _isVerified= await sign('Sign this message to verify your identity: ', wallet)

		if(_isVerified){

			// Load dashboard page
			secureLocalStorage.setItem("isLoggedIn", userType);
			secureLocalStorage.setItem("myWallet", userAddress?.address!);

			if (typeof window != "undefined") {
				window.dispatchEvent(new CustomEvent('login',  
				    {detail: {
						address: userAddress?.address,
						userType: userType
					},
		     	}))
			}

			setCurrentWallet(userAddress)
		}
		else{
			alert("ERROR: Your are not the owner of the wallet.")
		}

		//// TEST DATA en local ////

		setLoading(true);

		let _users = users;
		_users.push({wallet: "tz1Z6uQCVb3wzHuQgJgdnTBmPbugzGZJJkXn", name: "Thomas Rodriguez", email: "thomas@gmail.com", picture: 'https://onlyfeet.nyc3.cdn.digitaloceanspaces.com/next%2Ftezos%2Fneil-sims.png', position :"Software Developer"})
		_users.push({wallet: "tz1Z6uQCVb3wzHuQgJgdnTBmPbugzGZJJkXz", name: "Bernardo Sanchez", email: "bernardo@gmail.com", picture: 'https://onlyfeet.nyc3.cdn.digitaloceanspaces.com/next%2Ftezos%2Fthomas-lean.png', position :"Software Developer"})
		_users.push({wallet: "tz1Z6uQCVb3wzHuQgJgdnTBmPbugzGZJJkXa", name: "Lana Byrd", email: "lana@gmail.com", picture: 'https://onlyfeet.nyc3.cdn.digitaloceanspaces.com/next%2Ftezos%2Flana-byrd.png', position :"Software Developer"})
		setUsers(_users)

		let _projects = projects;
		_projects.push({id:"1", name:"Common Project", desc: "Everyone can access to these data.", image: "https://images.unsplash.com/photo-1620325867502-221cfb5faa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=857&q=80", date: new Date()})
		_projects.push({id:"2", name:"Confidential Project", desc: "Only people with the permission can access to these data.", image: "https://images.unsplash.com/photo-1527219525722-f9767a7f2884?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=873&q=80", date: new Date()})
		setProjects(_projects)

		setLoading(false);

		///////////////
	};

	// method to sign a message with a wallet
	const sign = async (message: string, wallet: any) => {
		// The data to format
		const dappUrl = 'tezos-test-d.app';
		const ISO8601formatedTimestamp = new Date().toISOString();

		// The full string
		const formattedInput: string = [
		message,
		dappUrl,
		ISO8601formatedTimestamp,
		].join(' ');

		// The bytes to sign
		const bytes = char2Bytes(formattedInput);
		const payloadBytes = '05' + '0100' + char2Bytes(bytes!.length.toString()) + bytes;

		// get current wallet address
		const _currentWallet = await wallet.client.getActiveAccount()

		// The payload to send to the wallet
		const payload: RequestSignPayloadInput = {
		signingType: SigningType.MICHELINE,
		payload: payloadBytes,
		sourceAddress: _currentWallet.address,
		};

		// The signing
		const signedPayload = await wallet.client.requestSignPayload(payload);

		// The signature
		const { signature } = signedPayload;

		const isVerified = await verifySig(payload.payload, signature, _currentWallet);

		return isVerified;
	}

	// verify if the message has been signed by the right wallet
	const verifySig = async (payloadBytes: string, signature: string, wallet:any) => {

		const isVerified = verifySignature(
			payloadBytes,
			wallet.publicKey,
			signature
		);
		console.log(isVerified);

		return isVerified;
	}

	const editUser = () => {

		setIsTablePopupVisible(false);
	}

	const popupRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		document.addEventListener("click", handleClickOutside, true)
	  },[]);
	const handleClickOutside = (e:any) => {
		if(!popupRef.current?.contains(e.target)){
			// click outside button
			setIsAlertPopupVisible(false)
			setIsTablePopupVisible(false)
			setIsActionListVisible(false)
		}
	}

	if (typeof window != "undefined") {
		window.addEventListener('logout', () => {

			setCurrentWallet(undefined)

			secureLocalStorage.setItem("isLoggedIn", '');
			secureLocalStorage.setItem("myWallet", '');

			setUsers([])
			setProjects([])
		});
		window.addEventListener('switchTab',  function( detail: any) {

			setCurrentTab(detail.detail)
		});
    }

	const changeOrganisationName = () => {
		
	}

	// mint une permisison et l'envoie a un wallet
	const _mintNFT = () => {

		const metadata = 'identifiant_unique' // id unique associé à un projet (chaque projet aura un id unique)
		mintNFT(metadata)
	}

	// verifie si le wallet possede le nft
	const _getNFT = (_id: string) => {
		
		const id = 'identifiant_unique' // this id represent the permission to access the specific ressource
		const contractAddress = 'KT1TZmNJfcWTYYXgt2M7V14syfCe19KnrHwV'

		getNFT(currentWallet?.address!, contractAddress, id)
	}

	const checkPermission = async (id: string) => {

		const wallet = await connectWallet();
		await sign('Sign this message to verify your identity: ', wallet);

		_getNFT(id)
	}

	const deleteUser = (_user: any) => {

		setUserSelected(_user)
		setIsAlertPopupVisible(true)
	}

	const confirmDeleteUser = (_user: any) => {

		setUsers(users.filter(user => user.wallet != _user.wallet));
		setIsAlertPopupVisible(false)
	}

	const selectAvatar = async(e:any) => {

		if (e.target.files[0] > 10e6) {
			window.alert("ERROR: Upload a file smaller than 10 Mb.");
			return;
		}
	  
		if (e.target.files && e.target.files[0]) {

			// upload and change
		}
	}

	const addUser = () => {

	}

	const controls = useAnimation();
	function onDragEnd(event:any, info:any) {
		const shouldClose =
		  info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 45);
		if (shouldClose) {
		//   controls.start("hidden");
		//   onClose();
		} else {
		//   controls.start("visible");
		//   onOpen();
		}
	}
	
	return(
	<Page>
		<Section>

			{currentWallet != undefined ?
			<>
            
			<Transition appear show={isAlertPopupVisible} as={Fragment}>
					<Dialog as="div" className="relative z-10" onClose={() => setIsAlertPopupVisible(false)}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<div className="px-8">
							<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 text-left align-middle transition-all shadow-2xl">
							<div className="mt-2">
					     		<svg aria-hidden="true" className="mx-auto mb-4 text-red-700 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
								<p className="text-lg leading-6 text-zinc-300 font-semibold">
							    	Are you sure you want to remove this user ?
								</p>
							</div>

							<div className="mt-4 flex flex-row space-x-4">
								<button
								type="button"
								className="inline-flex justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
								onClick={() => confirmDeleteUser(userSelected)}
								>
								Yes, I'm sure
								</button>
								<button
								type="button"
								className="inline-flex right-0 justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 border-zinc-300 focus-visible:ring-offset-2"
								onClick={() => setIsAlertPopupVisible(false)}
								>
								No, cancel
								</button>
							</div>
							</Dialog.Panel>
							</div>
						</Transition.Child>
						</div>
					</div>
					</Dialog>
				</Transition>

			{userType=='company' ?
			<>
			{currentTab=='team' ?
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-screen-xl mx-auto">
				<div className='pb-4 flex flex-row'>
					<p className='text-xl font-bold text-start sm:text-2xl  text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-300'>
						{organisationName}
					</p>
					<button onClick={changeOrganisationName} className="flex ml-3 mt-1.5 rounded-xl text-zinc-200 hover:scale-[1.05] transition-transform">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</button>
				</div>
				<div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-t-lg">
					<div>
						<button onClick={() => setIsActionListVisible(true)} id="dropdownActionButton" data-dropdown-toggle="dropdownAction" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:focus:ring-zinc-800" type="button">
							<span className="sr-only">Action button</span>
							Action
							<svg className="w-3 h-3 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
						</button>
						{/* <!-- Dropdown menu --> */}
						{isActionListVisible &&
						<div ref={popupRef} id="dropdownAction" className="z-10 mt-2 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-zinc-800 dark:divide-zinc-700">
							<ul className="py-1 text-sm text-zinc-800 dark:text-gray-200" aria-labelledby="dropdownActionButton">
								<li>
									<button onClick={() => setIsActionListVisible(false)} className="block w-full text-left rounded-t-xl px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:hover:text-white">Reward</button>
								</li>
								<li>
									<button onClick={() => setIsActionListVisible(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:hover:text-white">Promote</button>
								</li>
								<li>
									<button onClick={() => setIsActionListVisible(false)} className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:hover:text-white">Activate account</button>
								</li>
							</ul>
							<div className="py-1">
								<button onClick={() => setIsActionListVisible(false)} className="block w-full text-left rounded-b-xl px-4 py-2 text-sm text-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-gray-200 dark:hover:text-white">Delete User</button>
							</div>
						</div>
                        }

					</div>
					<label className="sr-only">Search</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
						</div>
						<input type="text" id="table-search-users" className="block p-2 pl-10 text-sm text-zinc-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for users"/>
					</div>
				</div>
				<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
					<thead className="text-xs text-zinc-800 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
						<tr>
							<th scope="col" className="p-4">
								<div className="flex items-center">
									<input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-900 dark:focus:ring-offset-zinc-900 focus:ring-2 dark:bg-zinc-800 dark:border-zinc-700"/>
									<label className="sr-only">checkbox</label>
								</div>
							</th>
							<th scope="col" className="px-6 py-3">
								Name
							</th>
							<th scope="col" className="px-6 py-3">
								Wallet
							</th>
							<th scope="col" className="px-6 py-3">
								Position
							</th>
							<th scope="col" className="px-6 py-3">
								Status
							</th>
							<th scope="col" className="px-6 py-3">
								
							</th>
							<th scope="col" className="px-6 py-3">
								
							</th>
						</tr>
					</thead>
					<tbody>
				    {users?.map((user:any, index:number) => {
						return(
						<tr key={index} className="border-b dark:bg-zinc-900 dark:border-zinc-800 odd:bg-white even:bg-gray-50 odd:dark:bg-zinc-900 even:dark:bg-zinc-800">
							<td className="w-4 p-4">
								<div className="flex items-center">
									<input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-900 dark:focus:ring-offset-zinc-900 focus:ring-2 dark:bg-zinc-800 dark:border-zinc-700"/>
									<label className="sr-only">checkbox</label>
								</div>
							</td>
							<th scope="row" className="flex items-center px-6 py-4 font-medium text-zinc-900 dark:text-white whitespace-nowrap">
								<Image draggable={false} width={40} height={40} className="w-10 h-10 rounded-lg" src={user.picture} alt="Jese image"/>
								<div className="pl-3">
									<div className="text-base font-bold">{user.name}</div>
									<div className="font-semibold text-gray-400">{user.email}</div>
								</div>  
							</th>
							<td className="px-6 py-4 text-black dark:text-gray-50 text-sm truncate cursor-pointer hover:dark:text-gray-200 max-w-xs" onClick={() => {navigator.clipboard.writeText(user.wallet)}}>
								{user.wallet}
							</td>
							<td className="px-6 py-4 text-black dark:text-gray-50 text-base">
								{user.position}
							</td>
							<td className="px-6 py-4">
								<div className="flex items-center text-black dark:text-gray-50 text-base">
									<div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"/>
									Online
								</div>
							</td>
							<td className="pl-3 py-4">
								{/* <!-- Modal toggle --> */}
								<button onClick={() => {
									setUserSelected(user)
									setIsTablePopupVisible(true)
								}} type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" className="text-white bg-gradient-to-br from-pink-500 to-violet-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 text-center inline-flex items-center shadow-md shadow-gray-300 dark:shadow-zinc-900 hover:scale-[1.02] transition-transform">Edit user</button>
							</td>
							<td className="pr-3 py-4">
								{/* <!-- Modal toggle --> */}
								<button onClick={() => deleteUser(user)} type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" className="text-white bg-gradient-to-br from-red-600 to-red-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 text-center inline-flex items-center shadow-md shadow-gray-300 dark:shadow-zinc-900 hover:scale-[1.02] transition-transform">Delete user</button>
							</td>
						</tr>
						)
					  })
					}
					  <tr className="border-b dark:bg-zinc-900 dark:border-zinc-800 odd:bg-white even:bg-gray-50 odd:dark:bg-zinc-900 even:dark:bg-zinc-800">
                            <td  colSpan={7} className="px-6 py-4 text-center justify-center">
								<button onClick={addUser} type="button" data-modal-target="editUserModal" data-modal-show="editUserModal" className="mx-auto text-white bg-gradient-to-br from-gray-700 to-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 text-center inline-flex items-center shadow-md shadow-gray-300 dark:shadow-zinc-900 hover:scale-[1.02] transition-transform">Add user</button>
							</td>
					  </tr>
					</tbody>
				</table>
				{/* <!-- Edit user modal --> */}
				{isTablePopupVisible &&
				<div id="editUserModal" aria-hidden="true" className="fixed top-0 left-0 backdrop-blur-sm backdrop-brightness-50 right-0 z-50 items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
					<div className="relative mx-auto w-full h-full max-w-2xl md:h-auto sm:mt-10" ref={popupRef}>
						{/* <!-- Modal content --> */}
						<form className="relative bg-white rounded-2xl border border-opacity-40 border-zinc-700 shadow dark:bg-zinc-800">
							{/* <!-- Modal header --> */}
							<div className="flex items-start justify-between p-4 border-b rounded-t dark:border-zinc-700">
								<h3 className="text-xl font-bold text-zinc-900 dark:text-white ml-1">
									Edit user
								</h3>
								<button onClick={() => setIsTablePopupVisible(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-zinc-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-zinc-700 dark:hover:text-white" data-modal-hide="editUserModal">
									<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
								</button>
							</div>
							{/* <!-- Modal body --> */}
							<div className="p-6 space-y-6">
								<div className="grid grid-cols-6 gap-6">
							    	<div className="col-span-6 sm:col-span-3">
										<div onClick={avatarInputRefClick} className="w-24 -mt-3 mx-auto">
											<img onClick={avatarInputRefClick} className="w-24 h-24 rounded-full absolute" src={userSelected?.picture} alt="" />
											<div onClick={avatarInputRefClick} className="w-24 h-24 group hover:bg-gray-200 opacity-60 rounded-full absolute flex justify-center items-center cursor-pointer transition duration-500">
												<img className="hidden group-hover:block w-12" src="https://www.svgrepo.com/show/33565/upload.svg" alt="" />
											</div>
											<input ref={avatarInputRef} onChange={(e) => { if((e.target.files && e.target.files[0]) && (e.target.files[0].type.startsWith("image"))) { selectAvatar(e); } else{ alert("ERROR: File selected is not an image.") } (e.target as HTMLInputElement).value = "";}} id="dropzone-file" type="file" accept="image/*" className="hidden" />
										</div>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label  className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Wallet</label>
										<input type="number" name="phone-number" id="phone-number" className="shadow-sm bg-gray-50 border border-gray-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userSelected?.wallet} required/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">First Name</label>
										<input type="text" name="first-name" id="first-name" className="shadow-sm bg-gray-50 border border-gray-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userSelected?.name} required/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Last Name</label>
										<input type="text" name="last-name" id="last-name" className="shadow-sm bg-gray-50 border border-gray-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userSelected?.name} required/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Email</label>
										<input type="email" name="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userSelected?.email} required/>
									</div>
									<div className="col-span-6 sm:col-span-3">
										<label className="block mb-2 text-sm font-medium text-zinc-900 dark:text-white">Position</label>
										<input type="text" name="department" id="department" className="shadow-sm bg-gray-50 border border-gray-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={userSelected?.position} required/>
									</div>
								</div>
							</div>
							{/* <!-- Modal footer --> */}
							<div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-zinc-700">
								<button onClick={editUser} type="submit" className="text-white bg-gradient-to-br from-pink-500 to-violet-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 text-center inline-flex items-center shadow-md shadow-gray-300 dark:shadow-zinc-900 hover:scale-[1.02] transition-transform">Save all</button>
							</div>
						</form>
					</div>
				</div>
				}
			</div>
			:
			// Projects tab for the company
			<div className='relative max-w-screen-xl mx-auto w-screen overflow-hidden'>
				{/* <div className=''>
					<Reorder.Group axis="y" values={users} onReorder={setUsers}>
						{users.map((user,index) => (
							<Reorder.Item key={user.wallet} value={user} id={user.wallet} 
							dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
							dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
							dragElastic={0.5}>
							<div className='w-80 rounded-lg bg-zinc-900 my-4 p-4 cursor-grab'>
								<p className='text-zinc-100 font-semibold'>
								{user?.name}
								</p>
							</div>
							</Reorder.Item>
						))}
					</Reorder.Group>
				</div> */}
				
			</div>
             }
			</>
			:
			// User Dashboard Projects
			<div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-screen-xl mx-auto">
				<div className='grid overflow-hidden grid-cols-1 min-[400px]:grid-cols-2 md:grid-cols-3 gap-5 p-4'>		
				{projects?.map((project:any, index:number) => {
						return(
						<div onClick={() => checkPermission(project.id)} key={project.id} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-zinc-900 dark:border-zinc-800 cursor-pointer hover:scale-[1.05] transition duration-300">
							<img className="rounded-t-lg" src={project.image} alt="" draggable={false}/>
							<div className="p-5">
								<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{project.name}</h5>
								<p className="mb-3 font-normal text-zinc-800 dark:text-gray-400">{project.desc}</p>
							</div>
						</div>
						);
					})
				}
				</div>
			</div>
            }
			</>
			:
			<div className="sm:flex sm:flex-col sm:align-center overflow-hidden -mt-12 sm:-mt-6 px-2"
			onMouseEnter={() => {
				// if(menuOpacity!=0)
				setMenuOpacity(1);
			  }}
			  onMouseLeave={() => {
				// if(menuOpacity!=0)
				setMenuOpacity(0.5);
			  }}
			  > 
			<motion.div	
			        drag={typeof window != "undefined" && window.innerWidth  >= 640 ? `x` : undefined}
					dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
					dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
					dragElastic={0.3}
					whileTap={{ cursor: "grabbing" }}
					className="max-w-md mx-auto"
					>
			<div className="sm:flex sm:flex-col border border-gray-600 border-opacity-20  g-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 px-6 py-8 rounded-3xl max-w-md mx-auto backdrop-brightness-75 shadow-2xl    transition-opacity duration-[2000ms] ease-out" style={{opacity: menuOpacity}}>
				<div className='flex flex-row mx-auto'>
		     		<Image
						src="/shield.png"
						alt="Precedent logo"
						width="48"
						height="48"
						className='mr-4 w-10 sm:w-16 sm:h-[3.7rem]'
						draggable={false} 
						unoptimized
					/>
					<h1 className="text-4xl font-bold text-start sm:text-center sm:text-6xl  text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-100">
						TezGuard
					</h1>
				</div>
				<p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
					No Password.
					No Risk.
				</p>


				<div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
					<button
					onClick={() => setUserType('company')}
					type="button"
					className={`${
						userType === 'company'
						? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
						: 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
					} rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
					>
					Company
					</button>
					<button
					onClick={() => {
						setUserType('user')
					}}
					type="button"
					className={`${
						userType === 'user'
						? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
						: 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
					} rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
					>
					Employee
					</button>
				</div>

				<div className='mx-auto  items-center justify-center text-center mt-4'>
					{userType == 'user' ?
						<button onClick={loginWallet} className="w-full sm:ml-2.5 sm:w-[270px] text-white bg-gradient-to-br from-pink-500 to-violet-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 text-center items-center shadow-md shadow-zinc-900 hover:scale-[1.02] transition-transform">
							Dashboard
						</button>
						:
						<button onClick={loginWallet} className="w-full sm:ml-2.5 sm:w-[270px] text-white bg-gradient-to-br from-pink-500 to-violet-500 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 text-center items-center shadow-md shadow-zinc-900 hover:scale-[1.02] transition-transform">
							Manage
						</button>
					}
				</div>
				
				{userType=='company' ?
				<p className="mt-5 text-base text-zinc-300 sm:text-center sm:text-lg sm:max-w-sm m-auto">
					Start managing your team. Give permissions to each individuals of your organisation.
			    </p>
				:
				<p className="mt-5 text-base text-zinc-300 sm:text-center sm:text-lg sm:max-w-sm m-auto">
					Join your organisation. Start working on your projects without data leak risk.
			    </p>
				}
            </div>
			</motion.div>
				
			<p className="mt-10 sm:mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em] transition-opacity duration-[2000ms] ease-out" style={{opacity: menuOpacity}}>
				Brought to you by
			</p>
			<div className="flex-col items-center space-y-4 2xl:mt-8 sm:space-y-0 mt-6 sm:mt-4 mx-auto md:max-w-2xl grid space-x-auto sm:gap-6 grid-cols-2 sm:grid-cols-4 transition-opacity duration-[2000ms] ease-out" style={{opacity: menuOpacity}}>
				<div className="flex items-center justify-center sm:justify-start">
				<a href="https://nextjs.org" 
				aria-label="Next.js Link"
				target="_blank"
				rel="noopener noreferrer"
				draggable={false} 
				>
					<img
					src="/nextjs.svg"
					alt="Next.js Logo"
					className="h-12 text-white"
					draggable={false} 
					/>
				</a>
				</div>
				<div className="flex items-center justify-center sm:justify-start">
				<a href="https://vercel.com" 
				aria-label="Vercel.com Link"
				target="_blank"
				rel="noopener noreferrer"
				draggable={false} 
				>
					<img
					src="/vercel.svg"
					alt="Vercel.com Logo"
					className="h-6 text-white"
					draggable={false} 
					/>
				</a>
				</div>
				<div className="flex items-center justify-center sm:justify-start">
				<a href="https://tezos.com" 
				aria-label="tezos.com Link"
				target="_blank"
				rel="noopener noreferrer"
				draggable={false} 
				>
					<img
					src="/tezos.png"
					alt="tezos.com Logo"
					className="h-10 text-white"
					draggable={false} 
					/>
				</a>
				</div>
				<div className="flex items-center justify-center sm:justify-start">
				<a href="https://github.com/clementroure/TezGuard" 
				aria-label="github.com Link"
				target="_blank"
				rel="noopener noreferrer"
				draggable={false} 
				>
					<img
					src="/github.svg"
					alt="github.com Logo"
					className="h-8 text-white"
					draggable={false} 
					/>
				</a>
				</div>
				</div>
			</div>

            }
			
		</Section>
	</Page>
	);
}