# [121-1] Web Programming Final 

## (Group 03) 不揪 Food Date

## Demo Video Link



## Deployed Link

<https://food-date.vercel.app/>

## Intro

_不揪 Food Date_ is a powerful restaurant gathering app. Each user can browse a map with all restaurant near NTU we recommended. It also includes a powerful food lottery, which can help you deciding what to eat. After you got some thoughts, you can use our remarkable date-matching system, join a date with other foodies! Also, we've got a user's coin ranking system and a list of missions and games, great news for those who want to get coins for fun.

## Deployed Service Usage

We allow users to sign up for regular accounts, but also provide an admin account as follows for you:
- Account:  admin@ntu.edu.tw
- Password: fShfdfrRF9fus9Y
You can register regular account and enjoy all of our services, and use admin account to create and delete missions.

## Packages/Framework/Code Ref

react-google-maps Docs: [https://visgl.github.io/react-google-maps/](https://visgl.github.io/react-google-maps/)

roulette code ref:
<https://github.com/effectussoftware/react-custom-roulette>
<https://www.npmjs.com/package/react-custom-roulette?activeTab=readme>

## Packages/Framework/Code Used

Next.JS, Tailwind CSS, Material UI, Material Icon, Lucide React Icon, Pusher, Cloudinary, react-linkify, zod, react-custom-roulette, vis.gl/react-google-maps, Google Maps API, Next auth, Drizzle ORM, PostgreSQL

## Thoughts

標彥廷：原本以為考完期末考後有一個多禮拜的時間可以完成這個 project，沒想到中間出了點問題導致我們最後幾天才能瘋狂趕工。做出來的結果雖然不是完美但也相當的有挑戰性，其中把 Google Map 嵌到我們的網站是最難的。目前的結果是一個初始的版本，未來如果有機會的話也希望可以把這個 project 做得更加完善，將各項功能做得更好。

荻本俊輝：雖然製作本專題比想像中還要辛苦很多，可是還是成功做出一個相當完整的網路服務，過程中也學到了不少網路服務設計技巧，很高興能和我的組員一起做出網站並成長！

李梁玉軒：第一次和同學們一起三人組隊使用Github管理project，最容易面臨的問題就是merge conflict，當你以為大家都會乖乖進行自己分內的工作，卻發現每個人都把歪腦筋動到別人做的components上，這種體會對我來說還是記憶猶新。作為project idea的提供者，我在裡面加入了一些普通的網服作業中不會看到的奇特元件和操作，甚至使用到geolocation等服務來半強迫使用者玩這種探索餐廳的大地遊戲，希望大家會喜歡。

# About the App

### Warnings

- Please prevent refreshing or reloading the website unless necessary. Each refresh uses a quota.

### Running the app

1. Install dependencies

   ```bash
   yarn install
   ```

2. Create a copy of `.env.example` as `.env.local` and replace `"YOUR-API-KEY-HERE"` with your Google API key and `"YOUR-MAP-ID-HERE"` with your Map ID, replace  `POSTGRES_URL_HERE` with the postgresURL, finally fill up pusher settings. You can also adjust `NEXT_PUBLIC_VERIFY_DISTANCE_BASE` if you are too lazy to walk near to any restaurants.
For your referrence, our PostgresURL: 
postgresql://wpfooddate:ny10rapwHxcm@ep-curly-leaf-13171890.ap-southeast-1.aws.neon.tech/fooddate?sslmode=require

3. Run migrations

   ```bash
   yarn migrate
   ```

4. Start the development server

   ```bash
   yarn dev
   ```

5. Open http://localhost:3000 in your browser

### Tasks
標彥廷：UI設計、頁面切割、profile頁面、admin帳號相關、mission相關、資料庫設計
李梁玉軒：restaurant頁面、restaurants資料更新與即時處理、googleMap API相關
荻本俊輝：資料庫設計、git技術指導、聚餐配對頁面、聊天室頁面與通知、Pusher服務架設
外掛：無

### Disclaimer
此專題為自行發想，如有雷同，純屬巧合
