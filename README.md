# To Generate key

`keytool -genkey -v -keystore android-release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000`

## Password 

Bawes@231!

## List key 

`keytool -list -v -keystore D:\xampp\htdocs\plugn-dashboard-ionic\android-release.keystore`

65:61:CD:01:87:BB:88:54:19:73:4B:F7:8A:55:38:92:D5:01:33:E1:C3:E9:96:18:27:58:D8:8D:20:5A:F0:F6


** Docker 

To run in container 

`docker compose up`

** Build and Deploy using Dockerfile

To build a Docker Image, we have to run the following command in our terminal:

`docker build -t <image-name>:<tag-name> .`

To run the built docker image, use the following command:

`docker run -d --publish 3000:80 --name <image-name> --network <your local ip> <image-name>:<tag-name>`

To run container 

`docker run -d --publish 3000:80 <image-name>`

To access in browser 

`http://localhost:3000`

For ionic serve command, replace port 3000 with 8100 

For more commands follow the link 

https://raw.githubusercontent.com/sangam14/dockercheatsheets/master/dockercheatsheet8.png


Test 
- transfer flow 
- candidate request flow 
- all pages and sub pages 
- why able to invite already assigned candidate ?
- badge background 
- create transfer option popup color + ui 

To test for transfer

- transfer with parent
  - calculation 
  - receipt 
  - invoice 
  - excel upload with minutes + seconds 
  - excel template with minutes + seconds 
  - transfer with 0 hours 30 min 30 seconds 
  - stats 
  - listing + details pages in all apps 
  
- without parent 


todo

- separate page for monthly / fix contract 

monthly /fix contract 
- list candidates 
- show candidate_total, company_total, transfer cost  

validation in backend for monthly / fix contract 
- company_total > candidate_total + transfer cost 

on transfer edit > open page based on transfer contract type 

on new transfer init > select contract > move to transfer form based on contract selection 


import transfer excel candidates' validation if contract selected
- should not have candidate belong to other contract or no contract 

# update tailwind css 
npx tailwindcss -i ./src/tailwind.css -o ./src/output.css --watch


-------------

have transfer type dropdown
on selection filter candidate with that contract type
on transfer excel, pass the contract type and have excel candidates with that contract type

that way we will able to generate transfer excel with correct candidates 

also show contract details in transfer form 

remove start date/ end date from candidate contract 

test
- all the transfer type and check if calculations 




