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
