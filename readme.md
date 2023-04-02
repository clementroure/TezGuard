Video: https://youtu.be/zdNbWseWQck

This project is a minimalist demo of our NFT authentification system, made for companies.

This project uses the latest and most advanced technologies in web developement :

It is made with Next.js, a meta-framework of React.js.

When we will build the final version of this project, we will be able to have an excellent page loading speed and SEO ranking thanks to the server-side rendering offered by Next.

This app is also a PWA : The users can install it and uses it like a native mobile app or a desktop application.

//// SMART CONTRACT ////

The NFT is a non-transferable one. It has been made using parts of the FA2_lib (https://smartpy.io/templates/fa2_lib.py)

The address is: KT1TZmNJfcWTYYXgt2M7V14syfCe19KnrHwV (https://ghostnet.tzkt.io/KT1TZmNJfcWTYYXgt2M7V14syfCe19KnrHwV/operations/)

You can find it in the "contracts" folder or in the Smartpy IDE : (https://smartpy.io/ide?code=eJxlUl1r2zAUffevEHqyWXBYOrIRCKwZSUdgoaHp6PoiZEvyxKyP6V43OKX_fZLdZizTg7m@OufonCtp411AAoYH9D3hQMBnm@sZWcai1K7UA4BBHbRHpoIzrAttTn8ielhMp6_MCJ2iNL7lKGGq@Iy1uip9T4ssq1sOQHabQx6Fyw2f7RROSKqvhdF2LL9pi@f@qgs2_hSLjMQlpCKMaauRsRxkqyaEj0QjkQuO_BWY1t8jygvOG3hCvGt13ceICbxzh8AtKBnyovhHZnB3qTKcHEN9juPhQrAYF3PLjVzSVEIMnPwO7WgrCg6McZ6RECRATvH0vvkhjrK5vZs_rMX6ad5cre@O6v6@7z7KD_vV76dPNLmpXPU_9XHe7b98r66Op6_dvtk2wh5W5rbqmtPN43b768HSMUj8QC0tD9qNIskVe2vlZ5BVGPfTBQ1elxfTHaiVbpjhPn@mtbMoLdJFaneoWyirPiozpxhg0LbJKaXPNA0lguhBnm46HgSdECrk@JC0s2krHkk6kCK9Oy@D0aDBWaAvUaB4Ga7jHODdMvnM_gC1Ft2D)

Then, we uses the tzkt API to check if a specific wallet hold a NFT associated with a project. If it does, the user can access a private dashboard and / or confidential data

//// RUN THE APP ///

(in the console)

yarn install
yarn run dev 

or go to https://tezos-hackathon.vercel.app (hosted on Vercel)