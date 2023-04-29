# TezGuard
## No password. No risk.

This project has been made in 48H during a Tezos hackathon.

Demo: https://youtu.be/zdNbWseWQck

This project is a minimalist demo of our NFT authentification system, made for companies.

This project uses the latest and most advanced technologies in web developement :

It is made with Next.js, a meta-framework of React.js.

When we will build the final version of this project, we will be able to have an excellent page loading speed and SEO ranking thanks to the server-side rendering offered by Next.

This app is also a PWA : The users can install it and uses it like a native mobile app or a desktop application.

//// SMART CONTRACT ////

The NFT is a non-transferable one. It has been made using parts of the FA2_lib (https://smartpy.io/templates/fa2_lib.py)

The address is: KT1TZmNJfcWTYYXgt2M7V14syfCe19KnrHwV (https://ghostnet.tzkt.io/KT1TZmNJfcWTYYXgt2M7V14syfCe19KnrHwV/operations/)

You can find it in the "contracts" folder or in the Smartpy IDE : (https://smartpy.io/ide?code=eJytVVtv2zYUfs@vINQXGRWc2B2yIYCAOZvTIUOcBlW3LkVBUOKRQ0QiNZKq5wT57zukKNlKlsIPEwybPpeP37lK1I3SlpiaadtsCTPENEcXizlJ8TAVaiq8ATWFFo2lpVY1bXUVR3fWNubs@Dh4oumxhbqpmAVzXLI5rUQ@bbbR5AgFVsj1_4JIA1iHfFRUzBiyushipDy9YPNVaRPizgteC9kdr4S0g_y81RL_TM6OCD4cSkKpkMJSGhuoyoSwzrEGyzizLBi6Z3fF9JlPb5yQRlWi2GKoznilMs2kKUHHk8kIxrN7juJvxqB@xjQxzn2osWQ1pJE7GgzY8fVipOUBvU@XWXTRYEwc2YfZ@i@@gfWHj6efl3z57XT9bvlxU376tG1_hB9uzv_@9lPU8clV_tL59rS9@eWP_N3m4bf2Zn255jI7rz_k7frh_e3l5f1nGZz9lylAMi1UB@O40V4U75nJ0qKFK5RnnD7LsnfOxZrWrIkfo0JJC9JGZ07cWlGZab5FbKpKaqzG@sdRFD1GLjloFGXw8L5lmkcJiTh0jSWUdCq8krQGuOvsBnQtjDBKmugJASZPoSxDEG9Tx7RL7RuSYTTEcdGssEH2JxCmASFdR9s7IBiHdXHcKR5M3pKNMwCvDg1hFeHCsLxCaegJ86KCPnusKFQrbRz5HhEYLrNKh5QzBIP_NHaKYGTV_QmteWjCmt0D7fMc2ilT9yDJLWiFGeNQiJpVJp0lxGzrXFXe4GSHNjsE7VrC62CzHdj8ELBs8x1m8wCWXf@@XNGrZbb4dZEtEPNLiDzpSSf9hV@9w57p0Ff99a61_BYSTemWEPzDcPW4lO4WRaORLpYb5zlnBqjfPun@5umqna6UhL3FYV1MQ6B4@5j5YFcBX4NG_ePJWVfqfi4TMnshmT@TPA04GixuObLjGA8q9wxD1xNIRuox23T8d2zaEU67n7EqZKL72akm_Wxd@YkxYVT41A1WwaqKGFUDUaUbnpq4l4MfIzy4lcCn3r1UmlDMOcHJ@bLL_9e9lIfXhJ@SQmHhfN1KVoCJ9wvpYPaW88ivn9TvObwZu@SsYrIA7KaDb5Hq9YuGjnrxOnkFTG0k6APxrp3toZAKP7g_3S46KC__AgMopqc-)

Then, we uses the tzkt API to check if a specific wallet hold a NFT associated with a project. If it does, the user can access a private dashboard and / or confidential data

//// RUN THE APP ///

yarn install
yarn run dev 
