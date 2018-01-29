// yelpfunc.js

const rev = {
  processYelpData: function(restaurants) {

    //1. average stars of all restaurants
    const sum = (restaurants.reduce(function(accum, ele) {
      if (ele.stars) {
        return accum += ele.stars;
      } else {
        return accum;
      }
    }, 0));

    console.log("* Average Rating of the dataset is: " + (sum / restaurants.length).toFixed(2) + "\n");

    //2. All Pizza places in Las Vegas, NV
    const LasVegasPizzaRestaurants = restaurants.filter(function(ele) {
      return ele.city === "Las Vegas" && ele.state === 'NV' && ele.categories.includes("Pizza");
    });

    let lvresults = " ";
    LasVegasPizzaRestaurants.forEach(function(ele) {
      lvresults += "\t* " + ele.name + "    (* " + ele.stars + " stars *)\n";
    });

    console.log("* All restaurants in Las Vegas, NV that serve Pizza: \n",
      lvresults);

    //3. The Two Mexican Restaurants with the most reviews
    const mexicanRestaurants = restaurants.filter(function(ele) {
      if (ele.hasOwnProperty("categories")) {
        return ele.categories.includes("Mexican");
      }
    }); // <--- now we have all mexican restaurants in an array, now lets sort them

    //sort them here
    mexicanRestaurants.sort(function(a, b) {
      return (a.review_count > b.review_count) ? -1 : 1; //sorted in descending order
    });

    //const topMex = mexicanRestaurants.slice(0, 2); //cut the array to only first 2 in arr, the top 2 most reviews
    const mexicanRes = "\t* " + mexicanRestaurants[0].name + " " + mexicanRestaurants[0].city + " (" + mexicanRestaurants[0].state + "), " + mexicanRestaurants[0].review_count + " reviews (* " + mexicanRestaurants[0].stars + " stars *)\n" + "\t* " + mexicanRestaurants[1].name + " " + mexicanRestaurants[1].city + " (" + mexicanRestaurants[1].state + "), " + mexicanRestaurants[1].review_count + " reviews (* " + mexicanRestaurants[1].stars + " stars *)\n";
    console.log("* The two highest reviewed Mexican serving restaurants are:");
    console.log(mexicanRes);


    //4. most common name in the dataset
    const restAll = restaurants.sort(function(a, b) { //sort list alphabetically by name
      return (a.name > b.name) ? -1 : 1; //sorted in descending order
    });

    let maxMode = 1; //stores the current maximum mode
    let counter = 1; //counts name occurences
    let previous = restAll[0].name;
    let currentName = restAll[0].name;

    let i;
    for (i in restAll) {

      //if object appears again, do this!
      if (previous === restAll[i].name) {
        counter++;
        if (counter > maxMode) {
          currentName = restAll[i].name;
          maxMode = counter;
        }

        //otherwise, keep going
      } else {
        counter = 1;
        previous = restAll[i].name;
      }
    }

    console.log("* The most common name in the dataset:");
    const mode = "\t* " + currentName + " is the most common business and appears " + maxMode + " times in the dataset.\n";
    console.log(mode);



    //5. find all restaurants per state

    const stateArr = restaurants.map(function(ele) { //array turned in to states only
      return ele.state;
    });

    stateArr.sort(); //sort it

    let previous1 = "";
    const a = []; //array that will create array of unique states only
    const b = []; //array that will store occurences per state in orig array
    for (let i = 0; i < stateArr.length - 1; i++) {
      //if we see state for the first time in the array then
      if (stateArr[i] !== previous1) {
        // a[i].name = stateArr[i];
        // a[i].count = 1;
        a.push(stateArr[i]); //add the state name to array A
        b.push(1); //add 1 to array B
      } else {
        b[b.length - 1]++;
        //a[a.length - 1].count++;
      }
      previous1 = stateArr[i];
    }

    let stateRestCount = "";
    for (let i = 0; i < a.length; i++) {
      // stateRestCount.push({
      //   state: a[i],
      //   count: b[i]
      // }); //add object literal if you wanted to do it this way
      stateRestCount += "\t* " + a[i] + ": " + b[i] + "\n";
    }

    console.log("* Restaurant count by state");
    console.log(stateRestCount);

  }
};
module.exports = rev;
