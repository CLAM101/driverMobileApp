# driverMobileApp
driver mobile app for food delivery system

## 4th September Commit:

Completely rebuilt driver app

found myself struggling to persist and manage state and navigation.

new app makes use of React Native Navigation and Redux Toolkit to manage navigation and state

App currently supports authentication and logged in persistance

the app will also persist the state of an active order based on where it is in the delviery process, this is persisted server side so even on a completely new instance an active order is not lost.

Google Mapview and mapview directions implemented, app will now load a route for each leg of the delivery eg. driver location to restaurant, restaurant to customer.

plan to add button for directions to be opened up in google maps app on device. 

driver can now accept or decline a collection, get navigation to the restaurant and confirm order pickup followed by getting directions to customer after collection and confirming dropoff and completion of order. 

am experiencing some latency issues with maps on some occasions where the route doesnt load properly, am investigating how to imporive performance.

other touches like loading bars still to be added.

Ive built out the space for order history and settings components but these are still to be built out as well.

## 6th September Commit:

styled all componenets except for settings and order history

replaced all buttons with touchable opacities 

included Lottie animations for loading between server calls 

loading animation will present when checking for active delivry and between all operations that take place within the delivery process.

added an automatic zoom to markers on map in EnRoute and DriverCollected componenets

added touchable opacity linked to google maps URL to DrierEnRoute and DriverCollected components, user can now open the route of each leg of the delivery in the google maps app

added additional distance checking in order to display all trip details on the acceptOrDecline componenet, all delivery detail is now presented to the driver on the accept or decline componenet 

## 15th September commit:

styled the rest of the app

fixed issue where autozoom wasnt working on map views when loaded via check order or when transitioning from driver en route to driver collected

added order history screen with basic table and pagination

I have now started on subscriber mobile app, which is being built in react Native with Typescript. 

all related repos are linked below. 


API: https://github.com/CLAM101/foodappapi.git 
RestWebApp: https://github.com/CLAM101/restWebApp.git 
SubMobileApp: https://github.com/CLAM101/subMobileApp.git 
