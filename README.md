# [111-1] Web Programming Final

## (Group 45) NTU BuyMe/NTU 幫買

### 影片連結：

https://youtu.be/WKg2YewF5cQ

### Deploy 連結

https://ntubuyme.up.railway.app/

-   操作方式：可以使用「R11725063 密碼：1111」、「R11725051 密碼：1111」兩個帳號進行測試

### 組員：

-   R11725063 蔡立倫
-   R11725051 賴彥良
-   R11725058 吳品萱

### 什麼是 NTU BuyMe？

不知道大家平日在校園裡面有沒有要吃飯卻懶得走出校園買的時候？這時我們都希望可以簡單叫個外送，但 UberEat、FoodPanda 都無法進入校園內，因此我們便創建了 NTU BuyME，同學可以在上面 po 出自己想要託人外送的餐廳、款項、外送費用，其他學生可以接單並在希望送達時間將餐點送達指定地點。我們也為 NTUBuyMe 增加了「chat」的功能，方便任務雙方雙方直接通訊；亦增加了「transfer」頁面，可以讓學生在上面直接搜索另一名學生的銀行帳戶，並產生轉帳 QR Code，以利交易雙方可以更輕鬆的轉錢。

### 頁面說明

-   Login：登入
-   Register：帳戶註冊，需填入學號、密碼、銀行帳戶，其中學號為 unique key
-   BuyMe：主頁面，在這裡可以看到所有人 po 出的需要幫忙的任務
-   MyTasks：可以看到自己 po 的以及接受的任務
-   Chat：接受任務之後將會出現新的 chatbox，點擊每一個 chat 即會開啟 chatbox，任務雙方可以在此商討任務細節
-   Transfer：能夠輸入他人的 id，查詢其銀行帳戶，點擊「QR Code」按鈕可以產生轉帳 QR Code
-   Account：可以對自身帳號進行設定

### 使用與參考之框架/模組/原始碼

-   Frontend
    -   React、Ant Design、axios、React Router
-   Backend
    -   NodeJS、Express、mongoose、bcrypt、Babel
-   Database
    -   MongoDB
-   Deploy
    -   Railway

### 使用之第三方套件、框架、程式碼

-   銀行帳戶 QR Code 產生器部分我們參考了 https://github.com/jefflin555/twpay 並針對原始碼改動以符合我們的專案架構

### 專題製作心得

-   蔡立倫
    -   此專案中我主要負責 navbar、create task、transfer、login、register 等頁面的製作，以及整體的 ui 設計、logo 製作等部分。除了實作上課學的 react、react router、axios、express 等內容之外，我也花了許多時間閱讀 ant design 的 document，並上網瀏覽其他人的 ui 設計，以調整 ui 至我們喜歡的樣子。其中因 ant design 的 component 原始設定為藍色，因此我也花了許多時間在每一個 component 的顏色設定，如更改 menu item 在 hover 時的顏色、按鈕的 border color 等。
-   賴彥良
    -   從 0 開始開發一個應用好花時間，第一次和團隊一起開發專案，種種的 bug 和令人抓狂的版本控制都讓 cowork 的過程充滿挑戰。 Deploy 的時候超級緊張，深怕會出什麼意外，還好最後有圓滿完成，謝謝我的組員們！
-   吳品萱
    -   這次期末專案的過程我們利用上課所學的 web socket, html 技術結合 Taiwan pay API 撰寫人力媒合平台「NTU BuyMe」。過程中除了自己刻畫面、撰寫前後端功能，也練習串接已經撰寫好的 API，也因此更了解了 CORS 相關的政策。很開心能夠透過這次機會學習到不同的網頁技術以及練習和組員合作進行專案。過程中雖然遇到許多困難，但是最後看到成果覺得非常有成就感！

### 如何在 localhost 安裝與測試之詳細步驟

    安裝：
    1. yarn
    2. cd frontend && yarn
    3. cd backend && yarn
    4. 同時需放入自己的 .env 檔於 backend 資料夾中

    測試：
    5. 於根目錄下 yarn server
    6. 於根目錄下 yarn start
    7. 進入 localhost://3000 進行測試
    8. 可以自行創立兩個帳號進行測試，範例如下
       1. Name：Law
       2. Id：R11725013
       3. Password：1111
       4. Bank id：812 台新銀行
       5. 11111111
    9. 若是 deploy 連結測試，可以使用「R11725063，密碼：1111」、「R11725051，密碼：1111」進行測試

    功能測試：
    可如影片 demo 所示，創建帳號之後測試 create task、接單、chat、transfer 等各功能

### 每位組員之負責項目 (請詳述)

-   蔡立倫：navbar、create task、transfer、login、register 等頁面的前後端製作，ui 設計、logo 設計
-   賴彥良：BuyMe、MyTasks、Chat 部分的前後端製作，主要負責寫後端，如 websocket、express、axios 的前後端串接
-   吳品萱：QR Code 產生器、Account 前後端製作、MyTasks 及 BuyMe 的 task render 功能
